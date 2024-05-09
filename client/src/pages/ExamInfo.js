// src/pages/ExamInfo.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamInfo = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/exam-info/${code}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Exam Information Page</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter exam code"
          value={code}
          onChange={e => setCode(e.target.value)}
          aria-label="Exam code"
          aria-describedby="button-addon2"
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={handleSubmit}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInfo;
