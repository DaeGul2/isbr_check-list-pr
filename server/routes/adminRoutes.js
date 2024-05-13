// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/auth/admin', adminController.authenticateAdmin);
router.get('/auth/check', adminController.checkAdminStatus);

module.exports = router;
