// routes/jobRoutes.js
const express = require('express');
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes protected
router.use(protect);

// Create job with resume & jd file upload
router.post(
  '/',protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jd', maxCount: 1 }
  ]),
  createJob
);

router.route('/')
  .get(getJobs);

router.route('/:id')
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
