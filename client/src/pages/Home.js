import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Home.css'; // 스타일시트
import axios from 'axios';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

   // axios instance 설정
   const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
  });

  const toggleModal = async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      if (!response.data.isAdmin) {
        setShowModal(true);
      } else {
        navigate('/admin-settings');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/admin', { code, password });
      if (response.data.isAdmin) {
        navigate('/admin-settings');
      } else {
        setShowModal(false);
      }
    } catch (error) {
      alert('Error: ' + error.message);
      setShowModal(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6 text-center">
          <h1 className="mb-4 title">인사바른 체크리스트</h1>
          <div className="d-grid gap-2">
            <button className="btn btn-primary btn-lg" onClick={() => toggleModal()}>관리페이지</button>
            <Link to="/exam-info" className="btn btn-secondary btn-lg">진행감독 입장</Link>
          </div>
        </div>
      </div>
      
      {/* 모달 구현 부분 */}
      {showModal && (
        <div className={`modal ${showModal ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <h2>관리자 로그인</h2>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>로그인</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
