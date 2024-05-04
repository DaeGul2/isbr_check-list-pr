// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // 추가된 스타일시트

const Home = () => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6 text-center">
          <h1 className="mb-4 title">인사바른 체크리스트</h1>
          <div className="d-grid gap-2">
            <Link to="/admin-settings" className="btn btn-primary btn-lg">관리자 입장</Link>
            <Link to="/exam-info" className="btn btn-secondary btn-lg">진행요원 입장</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
