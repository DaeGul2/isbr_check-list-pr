// routes/getProjectsRoutes.js
module.exports = (io) => {
    const express = require('express');
    const router = express.Router();
    const projectController = require('../controllers/projectController');
  
    // 소켓 인스턴스를 함께 넘기는 GET 요청 라우트
    router.get('/', (req, res) => projectController.getProjects(req, res, io));
  
    return router;
  };
  