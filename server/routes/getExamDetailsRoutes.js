// routes/getProjectsRoutes.js
module.exports = (io) => {
    const express = require('express');
    const router = express.Router();
    const examController = require('../controllers/examController');
  
    // 소켓 인스턴스를 함께 넘기는 GET 요청 라우트
    router.get('/', (req, res) => examController.getExamDetails(req, res, io));
  
    return router;
  };
  