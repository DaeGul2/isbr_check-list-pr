// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// 최초 프로젝트 생성 엔드포인트
router.post('/create', projectController.createProject);

module.exports = router;
