import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

const UpdateDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const apiKey = process.env.REACT_APP_API_KEY;
  const socket = io(API_URL);
  const [projectData, setProjectData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [newChecklistItems, setNewChecklistItems] = useState(['']);
  const [incompleteRooms, setIncompleteRooms] = useState([]);
  const [editingManager, setEditingManager] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const { code } = useParams();

  useEffect(() => {
    handleGetProjects();

    const handleProjectUpdated = (updatedProject) => {
      console.log('Project updated:', updatedProject);
      setProjectData(updatedProject);
      checkIncompleteRooms(updatedProject.examRooms, updatedProject.toCheckList);
    };

    socket.on('projectUpdated', handleProjectUpdated);

    return () => {
      socket.off('projectUpdated', handleProjectUpdated);
    };
  }, []);

  const handleGetProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams?code=${code}`, {
        headers: {
          'x-api-key': apiKey
        }
      });
      setProjectData(response.data);
      setNewChecklistItems(response.data.toCheckList);
      setIsLoaded(true);
      checkIncompleteRooms(response.data.examRooms, response.data.toCheckList);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      alert('데이터를 불러오는 데 실패했습니다.');
    }
  };

  const handleManagerChange = (e, roomNum) => {
    const updatedRooms = projectData.examRooms.map(room =>
      room.roomNum === roomNum ? { ...room, manager: e.target.value } : room
    );
    setProjectData({ ...projectData, examRooms: updatedRooms });
  };

  const handleChecklistChange = (e, roomNum, checkItem) => {
    const newValue = e.target.checked ? '완료' : '미완료';
    const updatedRooms = projectData.examRooms.map(room =>
      room.roomNum === roomNum ? { ...room, checklistItems: { ...room.checklistItems, [checkItem]: newValue } } : room
    );
    setProjectData({ ...projectData, examRooms: updatedRooms });
    checkIncompleteRooms(updatedRooms, projectData.toCheckList);
  };

  const updateExamRoom = async (roomData) => {
    try {
      const payload = {
        projectId: roomData.projectId,
        roomId: roomData.roomId,
        manager: roomData.manager,
        checklistItems: roomData.checklistItems
      };

      const response = await axios.put(`${API_URL}/api/examroom`, payload, {
        headers: {
          'x-api-key': apiKey
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
    setNewChecklistItems(newChecklistItems.filter((_, idx) => idx !== index));
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
          'x-api-key': apiKey
        }
      });
      setProjectData(updatedProjectData);
      alert('체크리스트가 업데이트되었습니다.');
    } catch (error) {
      console.error('체크리스트 업데이트 실패:', error);
      alert('체크리스트 업데이트에 실패했습니다.');
    }

    setModalShow(false);
  };

  const checkIncompleteRooms = (rooms, checklist) => {
    const incomplete = rooms.filter(room => {
      return checklist.some(item => room.checklistItems[item] !== '완료');
    });
    setIncompleteRooms(incomplete);
  };

  const handleSelectAllRooms = () => {
    if (selectedRooms.length === incompleteRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(incompleteRooms.map(room => room.roomNum));
    }
  };

  const handleRoomSelection = (roomNum) => {
    if (selectedRooms.includes(roomNum)) {
      setSelectedRooms(selectedRooms.filter(num => num !== roomNum));
    } else {
      setSelectedRooms([...selectedRooms, roomNum]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
  };

  const handleEditManager = (roomNum) => {
    setEditingManager(roomNum);
  };

  const handleSaveManager = (roomNum) => {
    setEditingManager(null);
  };

  if (!isLoaded) {
    return <div>Loading 중...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="card-header">
          <h1 className="card-title"><i className="fas fa-clipboard-list"></i> 시험명: {projectData.projectName}</h1>
        </div>
        <div className="card-body">
          <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-building"></i> 고사장: {projectData.venueName}</h2>
          <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-user-check"></i> 담당자: {projectData.overseers.join(' ')}</h2>
          <h2 className="mb-2 card-subtitle text-muted"><i className="fas fa-calendar-alt"></i> 날짜: {formatDate(projectData.examDate)}</h2>
          <Button variant="danger" onClick={() => setModalShow(true)}>
            체크리스트 추가/삭제
          </Button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table className="table table-bordered table-striped table-hover" style={{ minWidth: '1000px', tableLayout: 'fixed', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 2 }}>체크리스트</th>
              {projectData.examRooms.map((room, index) => (
                <th key={index} style={{ position: 'sticky', top: 0, background: 'white', zIndex: 2 }}>{room.roomNum}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>담당자</td>
              {projectData.examRooms.map((room, index) => (
                <td key={index}>
                  {editingManager === room.roomNum ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={room.manager}
                      onChange={e => handleManagerChange(e, room.roomNum)}
                      onBlur={() => handleSaveManager(room.roomNum)}
                    />
                  ) : (
                    <span>
                      {room.manager}{' '}
                      <Button variant="link" size="sm" onClick={() => handleEditManager(room.roomNum)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </span>
                  )}
                </td>
              ))}
            </tr>
            {projectData.toCheckList.map((item, idx) => (
              <tr key={idx}>
                <td>{item}</td>
                {projectData.examRooms.map((room, index) => (
                  <td key={index} style={{ backgroundColor: getBackgroundColor(room.checklistItems[item]) }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={room.checklistItems[item] === '완료'}
                      onChange={e => handleChecklistChange(e, room.roomNum, item)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>업데이트</td>
              {projectData.examRooms.map((room, index) => (
                <td key={index}>
                  <Button variant="success" onClick={() => updateExamRoom({
                    projectId: projectData._id,
                    roomId: room._id,
                    manager: room.manager,
                    checklistItems: room.checklistItems
                  })} size="sm">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>체크리스트 추가/삭제</Modal.Title>
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
          <Button variant="primary" onClick={handleAddChecklistItemsToProject}>업데이트</Button>
        </Modal.Footer>
      </Modal>

      <div style={{ marginTop: '2rem' }}>
        <h3>체크리스트가 완료되지 않은 고사실</h3>
        <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Button variant="secondary" size="sm" onClick={handleSelectAllRooms} style={{ marginRight: '0.5rem' }}>
            전체 선택
          </Button>
          {incompleteRooms.map(room => (
            <Badge
              key={room.roomNum}
              bg={selectedRooms.includes(room.roomNum) ? "primary" : "secondary"}
              onClick={() => handleRoomSelection(room.roomNum)}
              style={{ cursor: 'pointer', marginRight: '0.5rem' }}
            >
              {room.roomNum}
            </Badge>
          ))}
        </div>
        {selectedRooms.length > 0 && (
          <div className="row mt-3">
            {selectedRooms.map(roomNum => {
              const room = incompleteRooms.find(r => r.roomNum === roomNum);
              return (
                <div key={room.roomNum} className="col-md-3">
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>고사실 {room.roomNum}</Card.Title>
                      <Card.Text>담당자: {room.manager}</Card.Text>
                      <ul className="list-group list-group-flush">
                        {projectData.toCheckList.map((item, idx) => (
                          <li key={idx} className="list-group-item">
                            {item}: {room.checklistItems[item] === '완료' ? <Badge bg="success">완료</Badge> : <Badge bg="danger">미완료</Badge>}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

function getBackgroundColor(status) {
  switch (status) {
    case '완료':
      return '#ccffcc'; // Light green
    case '미완료':
      return '#ffcccc'; // Light red
    default:
      return '#ffffff'; // White
  }
}

export default UpdateDetails;
