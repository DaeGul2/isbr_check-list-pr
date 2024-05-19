// examAdminRoutes.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');



module.exports = (io) => {
    
    router.put('/:examRoomId/addReview', (req, res) => examController.addAdminReview(req, res, io));
    
    return router;
  };


