const express = require('express');
const { submitApplication, getUserApplications, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const authMiddleware = require('../config/jwt');

const router = express.Router();

router.post('/', authMiddleware, submitApplication);
router.get('/my-applications', authMiddleware, getUserApplications);

module.exports = router;
