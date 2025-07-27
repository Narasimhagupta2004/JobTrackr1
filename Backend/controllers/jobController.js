// server/controllers/jobController.js
const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    console.log('Authenticated user:', req.user);
    const { company, position } = req.body;
    if (!company || !position) {
      return res.status(400).json({ msg: 'Company and position are required' });
    }

    const files = req.files;
    const resumePath = files?.resume?.[0]?.filename || null;
    const jdPath = files?.jd?.[0]?.filename || null;

    const job = await Job.create({
      ...req.body,
      user: req.user._id,
      resumePath,
      jdPath
    });
    res.status(201).json({ success: true, message: 'Job added successfully', job });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json({ msg: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
