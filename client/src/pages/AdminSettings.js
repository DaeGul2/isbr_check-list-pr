import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../Socket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const AdminSettings = () => {
  const [projectData, setProjectData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [overseers, setOverseers] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [checkListItems, setCheckListItems] = useState([]);
  const [examDate, setExamDate] = useState('');
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_API_KEY;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleGetProjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/projects', {
        headers: {
          'x-api-key': apiKey
        }
      });
      setProjectData(response.data.data);
    } catch (e) {
      alert('failed', e);
    }
  }, [apiKey]);

  const handleDelete = async (projectId) => {
    if (window.confirm('이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/api/projects/${projectId}`, {
          headers: {
            'x-api-key': apiKey
          }
        });
        alert('Project deleted successfully');
        handleGetProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete the project. Please check the console for more information.');
      }
    }
  };

  const handleEdit = (code) => {
    navigate(`/project-detail/${code}`);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => alert('코드가 클립보드에 복사되었습니다.'))
      .catch(err => console.error('Failed to copy code:', err));
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // 소켓 연결
    }

    const checkAdmin = async () => {
      try {
        const response = await axiosInstance.get('/auth/check', {
          headers: {
            'x-api-key': apiKey
          }
        });
        if (!response.data.isAdmin) {
          alert('권한이 없습니다');
          navigate(-1);
        } else {
          handleGetProjects();
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        alert('An error occurred while checking admin status');
        navigate(-1);
      }
    };

    checkAdmin();

    const handleProjectCreated = (data) => {
      alert('새로운 프로젝트가 생성됐습니다 : ' + data.project.projectName);
      handleGetProjects();
    };

    socket.on('projectCreated', handleProjectCreated);

    return () => {
      socket.off('projectCreated', handleProjectCreated);
    };
  }, [navigate, apiKey, handleGetProjects]);

  const handleSubmit = async () => {
    const payload = {
      overseers,
      projectName,
      venueName,
      numberOfRooms,
      toCheckList: checkListItems,
      examDate,
    };

    try {
      const response = await axiosInstance.post('/api/projects/create', payload, {
        headers: {
          'x-api-key': apiKey
        }
      });
      console.log('Project created:', response.data);
      alert('Project successfully created!');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create the project. Please check the console for more information.');
    }
  };

  const handleAddOverseer = () => {
    const newOverseer = prompt('Enter the name of the new overseer:');
    if (newOverseer) {
      setOverseers([...overseers, newOverseer]);
    }
  };

  const handleRemoveOverseer = (index) => {
    setOverseers(overseers.filter((_, idx) => idx !== index));
  };

  const handleAddCheckListItem = () => {
    const newItem = prompt('Enter the new checklist item:');
    if (newItem) {
      setCheckListItems([...checkListItems, newItem]);
    }
  };

  const handleRemoveCheckListItem = (index) => {
    setCheckListItems(checkListItems.filter((_, idx) => idx !== index));
  };

  const renderCards = () => {
    return (
      <div className="row">
        {projectData.map((project) => (
          <div key={project._id} className="mb-4 col-md-4">
            <div className="shadow-sm card" style={{
              borderRadius: '15px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#f9f9f9',
              position: 'relative'
            }}>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px'
                }}
                onClick={() => handleDelete(project._id)}
              >
                <i className="bi bi-trash"></i>
              </button>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '50px'
                }}
                onClick={() => handleEdit(project.code)}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <div className="card-body">
                <p className="card-text"> {new Date(project.examDate).toLocaleDateString()}</p>
                <h2>{project.projectName}</h2>
                <p className="card-text">
                  <strong style={{ color: 'red' }}>코드:</strong> {project.code}
                  <button
                    className="btn btn-light btn-sm"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleCopyCode(project.code)}
                  >
                    코드 복사
                  </button>
                </p>
                <p className="card-text"><strong>고사장:</strong> {project.venueName}</p>
                <p className="card-text"><strong>고사실:</strong> {project.numberOfRooms}</p>
                <p className="card-text"><strong>관리자:</strong> {project.overseers.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <button
        className="p-3 btn btn-success rounded-circle"
        onClick={toggleModal}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s, box-shadow 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 1)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.8)'}
      >
        +
      </button>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">프로젝트 추가</h5>
                <button type="button" className="close" onClick={toggleModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>프로젝트명:</label>
                  <input type="text" className="form-control" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>고사장 명:</label>
                  <input type="text" className="form-control" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>고사실 개수:</label>
                  <input type="number" className="form-control" value={numberOfRooms} onChange={(e) => setNumberOfRooms(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Exam Date:</label>
                  <input type="date" className="form-control" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                </div>
                <div>
                  <h5>관리자</h5>
                  {overseers.map((overseer, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                      {overseer} <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOverseer(index)}>Delete</button>
                    </div>
                  ))}
                  <button className="mt-2 btn btn-secondary" onClick={handleAddOverseer}>Add Overseer</button>
                </div>
                <div className="mt-3">
                  <h5>Checklist Items</h5>
                  {checkListItems.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                      {item} <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCheckListItem(index)}>Delete</button>
                    </div>
                  ))}
                  <button className="mt-2 btn btn-secondary" onClick={handleAddCheckListItem}>Add Checklist Item</button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Create Project</button>
                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="mt-4">진행중인 시험</h2>
      {renderCards()}
    </div>
  );
};

export default AdminSettings;
