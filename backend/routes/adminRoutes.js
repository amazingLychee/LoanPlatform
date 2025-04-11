const express = require('express');
const { getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const authMiddleware = require('../config/jwt');
const adminMiddleware = require('../config/adminMiddleware'); // ✅ 只允许管理员访问

const router = express.Router();

router.get('/applications', authMiddleware, adminMiddleware, getAllApplications);
router.put('/applications/:id', authMiddleware, adminMiddleware, updateApplicationStatus);

module.exports = router;
