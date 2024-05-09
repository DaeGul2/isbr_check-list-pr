import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';


const ExamDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const socket = io(API_URL);
  const [projectData, setProjectData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 상태 추가

  const { code } = useParams();  // 경로 파라미터에서 code 받기
  const handleGetProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/exams?code=${code}`);
      setProjectData(response.data);
      setIsLoaded(true); // 데이터 로드 완료 시 로딩 상태 업데이트
    } catch (error) {
      console.error('Failed to fetch project data:', error);
      alert('데이터를 불러오는 데 실패했습니다.');
    }
  };

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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options); // 'ko-KR'은 한국어 설정입니다.
  }

  if (!isLoaded) {
    return <div>Loading 중...</div>; // 로딩 중일 때 표시될 내용
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
                <th key={index}>{item}</th> // 각 체크리스트 항목을 헤더로 추가
              ))}
            </tr>
          </thead>
          <tbody>
            {projectData.examRooms.map((room, index) => (
              <tr key={index}>
                <td>{room.roomNum}</td>
                <td>{room.manager}</td>
                {room.checklistItems.map((checkItem, idx) => (
                  <td key={idx}>{room.checklistItems[checkItem]}</td> // 각 체크리스트 상태를 셀로 추가
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamDetails;
