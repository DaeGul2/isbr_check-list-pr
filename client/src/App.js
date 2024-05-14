// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminSettings from './pages/AdminSettings';
import ExamInfo from './pages/ExamInfo';
import ExamDetails from './pages/ExamDetails';
import UpdateDetails from './pages/UpdateDetails';
import NavbarComponent from './NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';  // CSS 파일을 import 합니다.

const App = () => {
  return (
    <Router>
      <NavbarComponent />
      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/exam-info" element={<ExamInfo />} />
          <Route path="/exam-info/:code" element={<ExamDetails />} />
          <Route path="/project-detail/:code" element={<UpdateDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
