import React, { useState, useEffect } from 'react';
import styles from './AdminSettings.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const AdminSettings = () => {
  const [projectData, setProjectData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [overseers, setOverseers] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [checkListItems, setCheckListItems] = useState([]);
  const [examDate, setExamDate] = useState('');
  const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:8080');
  const navigate = useNavigate(); // useHistory 훅 사용
  const handleBack = () => {
    navigate(-1); // 뒤로 가기 함수
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleGetProjects = async () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      console.log("durl", response.data.data)
      setProjectData(response.data.data);
    }
    catch (e) {
      alert('failed', e);
    }
  }
  useEffect(() => {
    handleGetProjects(); // 초기 데이터 로드

    const handleProjectCreated = (data) => {
      console.log(data);
      alert('새로운 프로젝트가 생성됐습니다 : ' + data.project.projectName);
      handleGetProjects(); // 실시간 목록 갱신
    };

    socket.on('projectCreated', handleProjectCreated);

    return () => {
      socket.off('projectCreated', handleProjectCreated);
    };
  }, []); // 의존성 배열에 socket을 포함하지 않음

  const handleSubmit = async () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const payload = {
      overseers,
      projectName,
      venueName,
      numberOfRooms,
      toCheckList: checkListItems,
      examDate
    };

    try {
      const response = await axios.post(`${API_URL}/api/projects/create`, payload);
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

  const renderTable = () => {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>연번</th>
            <th>시험</th>
            <th style={{color:"red"}}>코드</th>
            <th>고사장</th>
            <th>고사실</th>
            <th>관리자</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {projectData.map((project, index) => (
            <tr key={project._id}>
              <td>{index + 1}</td>
              <td>{project.projectName}</td>
              <td style={{color:"red"}}>{project.code}</td>
              <td>{project.venueName}</td>
              <td>{project.numberOfRooms}</td>
              <td>{project.overseers.join(', ')}</td> {/* 관리자 배열을 문자열로 변환 */}
              <td>{new Date(project.examDate).toLocaleDateString()}</td>
            </tr> 
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>Back</button> {/* 뒤로 가기 버튼 */}
      <button className="btn btn-success" onClick={() => toggleModal()}>프로젝트 추가</button>
      {showModal && (
        <div>
          <h1>프로젝트 추가</h1>
          <div className={styles.inputGroup}>
            <label>프로젝트명:</label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>고사장 명:</label>
            <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>고사실 개수:</label>
            <input type="number" value={numberOfRooms} onChange={(e) => setNumberOfRooms(e.target.value)} />
          </div>
          <div className={styles.itemList}>
            <h2>관리자</h2>
            {overseers.map((overseer, index) => (
              <div key={index} className={styles.item}>
                {overseer} <button onClick={() => handleRemoveOverseer(index)}>Delete</button>
              </div>
            ))}
            <div className={styles.buttonGroup}>
              <button onClick={handleAddOverseer}>Add Overseer</button>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Exam Date:</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div className={styles.itemList}>
            <h2>Checklist Items</h2>
            {checkListItems.map((item, index) => (
              <div key={index} className={styles.item}>
                {item} <button onClick={() => handleRemoveCheckListItem(index)}>Delete</button>
              </div>
            ))}
            <div className={styles.buttonGroup}>
              <button onClick={handleAddCheckListItem}>Add Checklist Item</button>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleSubmit}>Create Project</button>
          </div>
        </div>
      )}
      <h2>진행중인 시험</h2>
      {renderTable()}
    </div>
  );
};

export default AdminSettings;
