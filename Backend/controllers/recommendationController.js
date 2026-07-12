const OpenAI = require('openai');
const dotenv = require('dotenv');
const Job = require('../models/Job');

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  if (!magnitudeA || !magnitudeB) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const buildJobText = (job) => {
  const details = [
    `Position: ${job.position}`,
    `Company: ${job.company}`,
    `Status: ${job.status}`,
    `Source: ${job.source || 'Unknown'}`,
    job.notes ? `Notes: ${job.notes}` : null,
    job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : null,
  ].filter(Boolean);

  return details.join('. ');
};

exports.recommendJobs = async (req, res) => {
  const { profileText } = req.body;

  if (!profileText || profileText.trim().length === 0) {
    return res.status(400).json({ msg: 'profileText is required to generate recommendations' });
  }

  try {
    const jobs = await Job.find({ user: req.user._id });

    if (!jobs.length) {
      return res.json({ jobs: [] });
    }

    const jobTexts = jobs.map(buildJobText);
    const inputs = [profileText, ...jobTexts];

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputs,
    });

    const embeddings = response.data.map((item) => item.embedding);
    const profileEmbedding = embeddings[0];
    const jobEmbeddings = embeddings.slice(1);

    const recommended = jobs.map((job, index) => ({
      ...job.toObject(),
      fitScore: Math.round(cosineSimilarity(profileEmbedding, jobEmbeddings[index]) * 10000) / 100,
    }));

    recommended.sort((a, b) => b.fitScore - a.fitScore);
    return res.json({ jobs: recommended });
  } catch (err) {
    console.error('Recommendation error details:', {
      message: err.message,
      code: err.code,
      status: err.status,
      type: err.type,
      fullError: err,
    });
    return res.status(500).json({ 
      msg: 'Failed to generate recommendations',
      details: err.message 
    });
  }
};
