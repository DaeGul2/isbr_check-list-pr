import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Home.css'; // 스타일시트

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleModal = () => {
    console.log('Current showModal state:', showModal); // 상태 로깅
    setShowModal(!showModal);
  };
  

  const handleLogin = () => {
    if (code === 'isbr' && password === '8067') {
      navigate('/admin-settings');
    } else {
      alert('코드나 패스워드가 일치하지 않습니다.');
      setShowModal(false); // 입력이 잘못된 경우 모달 창을 닫습니다.
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
