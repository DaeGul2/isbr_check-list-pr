const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// 특정 projectId로 프로젝트 정보를 가져오는 라우트
router.get('/:projectId', projectController.getProjectById);


module.exports = router;