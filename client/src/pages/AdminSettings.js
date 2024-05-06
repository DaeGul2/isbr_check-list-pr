import React, { useState } from 'react';
import styles from './AdminSettings.module.css';

const AdminSettings = () => {
  const [overseers, setOverseers] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const [checkListItems, setCheckListItems] = useState([]);

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
    </div>
  );
};

export default AdminSettings;
