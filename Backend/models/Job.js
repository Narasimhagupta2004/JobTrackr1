const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    company: {
      type: String,
      required: [true, 'Company is required']
    },
    position: {
      type: String,
      required: [true, 'Position is required']
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
      default: 'Applied'
    },
    source: {
      type: String, // e.g., LinkedIn, Referral, etc.
      default: 'LinkedIn'
    },
    deadline: {
      type: Date
    },
    notes: {
      type: String
    },
    resumePath: {
      type: String, // Store filename like "resume-123456.pdf"
    },
    jdPath: {
      type: String, // Store filename like "jd-123456.pdf"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
