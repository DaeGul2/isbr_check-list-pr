// routes/projectRoutes.js
module.exports = (io) => {
    const express = require('express');
    const router = express.Router();
    const projectController = require('../controllers/projectController');
  
    router.put('/', (req, res) => projectController.updateProject(req, res, io));
  
    return router;
  };
  