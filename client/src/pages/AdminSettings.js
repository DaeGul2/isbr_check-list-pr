import React, { useState } from 'react';
import styles from './AdminSettings.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const [overseers, setOverseers] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [checkListItems, setCheckListItems] = useState([]);
  const [examDate, setExamDate] = useState('');
  const navigate = useNavigate(); // useHistory 훅 사용
  const handleBack = () => {
    navigate(-1); // 뒤로 가기 함수
  };


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

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>Back</button> {/* 뒤로 가기 버튼 */}
      <h1>관리자 페이지</h1>
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
  );
};

export default AdminSettings;
