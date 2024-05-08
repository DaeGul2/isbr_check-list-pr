// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');


// GET 요청으로 현재 진행 중인 프로젝트들 조회
router.get('/', projectController.getProjects);

module.exports = router;
