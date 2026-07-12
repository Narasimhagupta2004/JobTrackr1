const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { recommendJobs } = require('../controllers/recommendationController');

router.post('/', authMiddleware, recommendJobs);

module.exports = router;
