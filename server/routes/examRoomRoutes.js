const express = require('express');
const router = express.Router();
const examRoomController = require('../controllers/examController');

module.exports = (io) => {
  router.put('/:examRoomId/adminCheck', (req, res) => examRoomController.toggleAdminCheck(req, res, io));
  router.post('/:examRoomId/adminReviews', (req, res) => examRoomController.addAdminReview(req, res, io));
  
  return router;
};