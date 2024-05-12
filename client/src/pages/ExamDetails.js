import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ExamDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const socket = io(API_URL);
  const [projectData, setProjectData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    handleGetProjects(); // Load initial data
    
    const handleProjectUpdated = (updatedProject) => {
      console.log('Project updated:', updatedProject);
      setProjectData(updatedProject); // Update data in real-time
    };
    
    socket.on('projectUpdated', handleProjectUpdated);
    
    return () => {
      socket.off('projectUpdated', handleProjectUpdated);
    };
  }, []); 

  const { code } = useParams();
  const handleGetProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams?code=${code}`);
      setProjectData(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      alert('데이터를 불러오는 데 실패했습니다.');
    }
  };

  const updateExamRoom = async (roomData) => {
    try {
      await axios.put(`${API_URL}/api/examroom`, roomData);
      alert('시험실 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('시험실 업데이트 실패:', error);
      alert('시험실 정보 업데이트에 실패했습니다.');
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
  }

  if (!isLoaded) {
    return <div>Loading 중...</div>;
  }

  return (
    <div>
      <h1 key={projectData._id}>시험명 : {projectData.projectName}</h1>
      <h2>고사장 : {projectData.venueName}</h2>
      <h2>담당자 : {projectData.overseers.join(' ')}</h2>
      <h2>날짜 : {formatDate(projectData.examDate)}</h2>
      <h2>체크리스트 : </h2>
      <ol>
        {projectData.toCheckList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>고사실</th>
              <th>담당자</th>
              {projectData.toCheckList.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
              <th>업데이트</th>
            </tr>
          </thead>
          <tbody>
            {projectData.examRooms.map((room, index) => (
              <tr key={room._id}>
                <td>{room.roomNum}</td>
                <td>
                  <input
                    type="text"
                    value={room.manager}
                    onChange={e => {
                      const updatedRoom = {...room, manager: e.target.value};
                      setProjectData(current => {
                        let newData = {...current};
                        newData.examRooms[index] = updatedRoom;
                        return newData;
                      });
                    }}
                  />
                </td>
                {projectData.toCheckList.map((checkItem, idx) => (
                  <td key={idx} style={{backgroundColor: getBackgroundColor(room.checklistItems[checkItem])}}>
                    <input
                      type="checkbox"
                      checked={room.checklistItems[checkItem] === '완료'}
                      onChange={e => {
                        const newValue = e.target.checked ? '완료' : '미완료';
                        const updatedRoom = {...room};
                        updatedRoom.checklistItems[checkItem] = newValue;
                        setProjectData(current => {
                          let newData = {...current};
                          newData.examRooms[index] = updatedRoom;
                          return newData;
                        });
                      }}
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => updateExamRoom({
                    projectId: projectData._id,
                    roomId: room._id,
                    manager: room.manager,
                    checklistItems: room.checklistItems
                  })}>업데이트</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ExamDetails;
