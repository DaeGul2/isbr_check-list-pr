import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../Socket'; // 전역 소켓 인스턴스 가져오기
import './ExamDetails.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Form } from 'react-bootstrap';

const ExamDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const apiKey = process.env.REACT_APP_API_KEY; // 환경 변수에서 API 키 가져오기
  const [projectData, setProjectData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [newChecklistItems, setNewChecklistItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(() => {
    const saved = localStorage.getItem('selectedRooms');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // 소켓 연결
    }

    handleGetProjects();

    const handleProjectUpdated = (updatedProject) => {
      console.log('Project updated:', updatedProject);
      setProjectData(updatedProject);
    };

    socket.on('projectUpdated', handleProjectUpdated);

    return () => {
      socket.off('projectUpdated', handleProjectUpdated);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
  }, [selectedRooms]);

  const { code } = useParams();
  const handleGetProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams?code=${code}`, {
        headers: {
          'x-api-key': apiKey // 헤더에 API 키 포함
        }
      });
      setProjectData(response.data);
      setNewChecklistItems(response.data.toCheckList); // 현재 체크리스트를 모달에 표시하기 위해 설정
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      alert('데이터를 불러오는 데 실패했습니다.');
    }
  };

  const handleManagerChange = (e, index, room) => {
    const updatedRoom = { ...room, manager: e.target.value };
    setProjectData(current => {
      let newData = { ...current };
      newData.examRooms[index] = updatedRoom;
      return newData;
    });
  };

  const handleChecklistChange = (e, index, checkItem, room) => {
    const newValue = e.target.checked ? '완료' : '미완료';
    const updatedRoom = { ...room };
    updatedRoom.checklistItems[checkItem] = newValue;
    setProjectData(current => {
      let newData = { ...current };
      newData.examRooms[index] = updatedRoom;
      return newData;
    });
  };

  const updateExamRoom = async (roomData) => {
    try {
      await axios.put(`${API_URL}/api/examroom`, roomData, {
        headers: {
          'x-api-key': apiKey // 헤더에 API 키 포함
        }
      });
      alert('시험실 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('시험실 업데이트 실패:', error);
      alert('시험실 정보 업데이트에 실패했습니다.');
    }
  };

  const handleAddChecklistItem = () => {
    setNewChecklistItems([...newChecklistItems, '']);
  };

  const handleRemoveChecklistItem = index => {
    setNewChecklistItems(newChecklistItems.filter((item, idx) => idx !== index));
  };

  const handleChecklistItemChange = (event, index) => {
    const updatedItems = newChecklistItems.map((item, idx) => idx === index ? event.target.value : item);
    setNewChecklistItems(updatedItems);
  };

  const handleAddChecklistItemsToProject = async () => {
    const updatedProjectData = {
      ...projectData,
      toCheckList: newChecklistItems
    };
    try {
      await axios.put(`${API_URL}/api/projects`, { updatedProjectData }, {
        headers: {
          'x-api-key': apiKey // 헤더에 API 키 포함
        }
      });
      setProjectData(updatedProjectData); // 업데이트된 프로젝트 데이터를 상태에 설정
      alert('체크리스트가 업데이트되었습니다.');
    } catch (error) {
      console.error('체크리스트 업데이트 실패:', error);
      alert('체크리스트 업데이트에 실패했습니다.');
    }

    setModalShow(false);
  };

  const handleRoomSelection = (e) => {
    const roomNum = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedRooms([...selectedRooms, roomNum]);
    } else {
      setSelectedRooms(selectedRooms.filter(num => num !== roomNum));
    }
  };

  const handleSelectAllRooms = (e) => {
    if (e.target.checked) {
      const allRooms = Array.from({ length: projectData.numberOfRooms }, (_, i) => i + 1);
      setSelectedRooms(allRooms);
    } else {
      setSelectedRooms([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
  };

  if (!isLoaded) {
    return <div>Loading 중...</div>;
  }

  const filteredRooms = projectData.examRooms.filter(room => selectedRooms.includes(room.roomNum));

  return (
    <div>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header" onClick={toggleCard} style={{ cursor: 'pointer' }}>
            <h1 className="card-title"><i className="fas fa-clipboard-list"></i> 시험명: {projectData.projectName}</h1>
            <button className="btn">{isOpen ? <i>접기△</i> : <i>펼치기▽</i>}</button>
          </div>
          {isOpen && (
            <div className="card-body">
              <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-building"></i> 고사장: {projectData.venueName}</h2>
              <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-user-check"></i> 담당자: {projectData.overseers.join(' ')}</h2>
              <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-calendar-alt"></i> 날짜: {formatDate(projectData.examDate)}</h2>
              <h2 className="mb-2">체크리스트:</h2>
              <ol>
                {projectData.toCheckList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="container mt-3">
        <div className="room-selection" style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '20px' }}>
          <div style={{ display: 'inline-block', marginRight: '10px' }}>
            <label>
              <input
                type="checkbox"
                onChange={handleSelectAllRooms}
                checked={selectedRooms.length === projectData.numberOfRooms}
              />
              전체 check
            </label>
          </div>
          {Array.from({ length: projectData.numberOfRooms }, (_, i) => i + 1).map((roomNum) => (
            <div key={roomNum} style={{ display: 'inline-block', marginRight: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  value={roomNum}
                  onChange={handleRoomSelection}
                  checked={selectedRooms.includes(roomNum)}
                />
                {roomNum}
              </label>
            </div>
          ))}
        </div>
        
        <div className="row">
          {(selectedRooms.length > 0 ? filteredRooms : projectData.examRooms).map((room, index) => (
            <div className="mb-4 col-md-4" key={room._id}>
              <div className="card">
                <div className="card-header">
                  고사실: {room.roomNum}
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">담당자:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={room.manager}
                      onChange={e => handleManagerChange(e, index, room)}
                    />
                  </div>
                  {projectData.toCheckList.map((checkItem, idx) => (
                    <div className="mb-2 form-check" key={idx}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`check-${index}-${idx}`}
                        checked={room.checklistItems[checkItem] === '완료'}
                        onChange={e => handleChecklistChange(e, index, checkItem, room)}
                      />
                      <label className="form-check-label" htmlFor={`check-${index}-${idx}`}>
                        {checkItem}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="card-footer text-end">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => updateExamRoom({
                    projectId: projectData._id,
                    roomId: room._id,
                    manager: room.manager,
                    checklistItems: room.checklistItems
                  })} />
                  <span style={{ fontFamily: 'Indie Flower', fontSize: '1rem', marginLeft: '10px' }}>업데이트</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="danger" style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={() => setModalShow(true)}>
        체크리스트 추가/수정
      </Button>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>체크리스트 추가/수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newChecklistItems.map((item, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Control type="text" value={item} onChange={(e) => handleChecklistItemChange(e, index)} />
              <Button variant="danger" onClick={() => handleRemoveChecklistItem(index)}>삭제</Button>
            </Form.Group>
          ))}
          <Button onClick={handleAddChecklistItem}>항목 추가</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>닫기</Button>
          <Button variant="primary" onClick={handleAddChecklistItemsToProject}>저장</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamDetails;
