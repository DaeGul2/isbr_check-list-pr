import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamInfo = () => {
  const [code, setCode] = useState('');
  const [recentCodes, setRecentCodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCodes = JSON.parse(localStorage.getItem('recentCodes')) || [];
    setRecentCodes(storedCodes);
  }, []);

  const handleSubmit = () => {
    if (code) {
      addCodeToLocalStorage(code);
      navigate(`/exam-info/${code}`);
    }
  };

  const addCodeToLocalStorage = (newCode) => {
    const currentTime = new Date().toLocaleString();
    let storedCodes = JSON.parse(localStorage.getItem('recentCodes')) || [];
    storedCodes = storedCodes.filter(storedCode => storedCode.code !== newCode);
    storedCodes.unshift({ code: newCode, lastAccessed: currentTime });
    if (storedCodes.length > 5) {
      storedCodes.pop();
    }
    localStorage.setItem('recentCodes', JSON.stringify(storedCodes));
    setRecentCodes(storedCodes);
  };

  const handleRemoveCode = (codeToRemove) => {
    let storedCodes = JSON.parse(localStorage.getItem('recentCodes')) || [];
    storedCodes = storedCodes.filter(storedCode => storedCode.code !== codeToRemove);
    localStorage.setItem('recentCodes', JSON.stringify(storedCodes));
    setRecentCodes(storedCodes);
  };

  const handleNavigateToCode = (code) => {
    addCodeToLocalStorage(code);
    navigate(`/exam-info/${code}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">시험장 코드를 입력해주세요</h1>
      <div className="mb-3 input-group">
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
      <h3 className="mt-5">최근 기록</h3>
      <ul className="list-group">
        {recentCodes.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>Code:</strong> {item.code}</div>
              <div><small><strong>마지막 접속:</strong> {item.lastAccessed}</small></div>
            </div>
            <div>
              <button className="mr-2 btn btn-success btn-sm" onClick={() => handleNavigateToCode(item.code)}>이동</button>
              {' '}
              <button className="btn btn-danger btn-sm" onClick={() => handleRemoveCode(item.code)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamInfo;
