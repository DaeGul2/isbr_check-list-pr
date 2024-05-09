// routes/projectRoutes.js
module.exports = (io) => {
    const express = require('express');
    const router = express.Router();
    const projectController = require('../controllers/projectController');
  
    router.post('/create', (req, res) => projectController.createProject(req, res, io));
    router.get('/', (req, res) => projectController.getProjects(req, res, io));
  
    return router;
  };
  