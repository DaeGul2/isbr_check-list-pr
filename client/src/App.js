// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminSettings from './pages/AdminSettings';
import ExamInfo from './pages/ExamInfo';
import ExamDetails from './pages/ExamDetails';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/exam-info" element={<ExamInfo />} />
        <Route path="/exam-info/:code" element={<ExamDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
