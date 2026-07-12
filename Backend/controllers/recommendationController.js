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

const buildJobText = (job, jobDescription) => {
  const details = [
    jobDescription ? `Job Description: ${jobDescription}` : null,
    `Position: ${job.position}`,
    `Company: ${job.company}`,
    `Status: ${job.status}`,
    `Source: ${job.source || 'Unknown'}`,
    job.notes ? `Notes: ${job.notes}` : null,
    job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : null,
  ].filter(Boolean);

  return details.join('. ');
};

const extractKeywords = (text) => {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'have', 'this', 'from', 'your', 'will', 'into', 'about', 'over', 'their', 'been', 'were', 'year', 'years', 'experience', 'role', 'team', 'work', 'strong', 'skills', 'using', 'able', 'build', 'develop', 'developing', 'responsible', 'including', 'through', 'within', 'across', 'based', 'high', 'level', 'company', 'position', 'job'
  ]);

  return (text.toLowerCase().match(/[a-z]{3,}/g) || [])
    .filter((word) => !stopWords.has(word))
    .slice(0, 8);
};

const buildSummary = (fitScore) => {
  if (fitScore >= 80) return 'This looks like a strong match. The resume content aligns well with the role requirements.';
  if (fitScore >= 60) return 'This is a solid match with a few gaps that could be improved for a better fit.';
  return 'The match is moderate. Consider strengthening the resume around the job requirements and keywords.';
};

exports.recommendJobs = async (req, res) => {
  const { profileText, resumeText, jobDescription, selectedJobId } = req.body;
  const resumeInput = (resumeText || profileText || '').trim();

  try {
    let jobsToAnalyze = [];

    if (selectedJobId) {
      const selectedJob = await Job.findOne({ _id: selectedJobId, user: req.user._id });
      if (!selectedJob) {
        return res.status(404).json({ msg: 'Selected job not found' });
      }

      const selectedResume = selectedJob.resumePath ? `Resume file: ${selectedJob.resumePath}` : null;
      const selectedJd = selectedJob.jdPath ? `JD file: ${selectedJob.jdPath}` : null;
      const comparisonText = [
        jobDescription?.trim(),
        selectedJd,
        selectedResume,
        `Position: ${selectedJob.position}`,
        `Company: ${selectedJob.company}`,
        `Status: ${selectedJob.status}`,
        `Source: ${selectedJob.source || 'Unknown'}`,
        selectedJob.notes ? `Notes: ${selectedJob.notes}` : null,
        selectedJob.deadline ? `Deadline: ${new Date(selectedJob.deadline).toLocaleDateString()}` : null,
      ].filter(Boolean).join('. ');

      jobsToAnalyze.push({
        job: selectedJob,
        comparisonText,
      });
    } else {
      if (!resumeInput) {
        return res.status(400).json({ msg: 'Resume or profile text is required when no job is selected' });
      }

      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ msg: 'Job description is required when no job is selected' });
      }

      jobsToAnalyze.push({
        job: {
          _id: 'manual-job',
          position: 'Custom Role',
          company: 'Custom Company',
          status: 'Manual',
          source: 'Paste',
          notes: jobDescription.trim(),
        },
        comparisonText: jobDescription.trim(),
      });
    }

    if (!jobsToAnalyze.length) {
      return res.json({ jobs: [] });
    }

    const jobTexts = jobsToAnalyze.map((entry) => entry.comparisonText);
    const inputs = [resumeInput, ...jobTexts];

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputs,
    });

    const embeddings = response.data.map((item) => item.embedding);
    const profileEmbedding = embeddings[0];
    const jobEmbeddings = embeddings.slice(1);

    const recommended = jobsToAnalyze.map((entry, index) => {
      const jobObject = entry.job.toObject ? entry.job.toObject() : entry.job;
      const fitScore = Math.round(cosineSimilarity(profileEmbedding, jobEmbeddings[index]) * 10000) / 100;
      const jobText = entry.comparisonText;
      const resumeKeywords = extractKeywords(resumeInput);
      const jobKeywords = extractKeywords(jobText);
      const sharedKeywords = resumeKeywords.filter((keyword) => jobKeywords.includes(keyword));
      const missingKeywords = jobKeywords.filter((keyword) => !resumeKeywords.includes(keyword));

      return {
        ...jobObject,
        fitScore,
        summary: buildSummary(fitScore),
        strengths: sharedKeywords.length
          ? [`Matches the role around: ${sharedKeywords.join(', ')}`]
          : ['The resume and job description share relevant themes.'],
        gaps: missingKeywords.length
          ? [`Add more evidence for: ${missingKeywords.join(', ')}`]
          : ['Highlight more measurable achievements and role-specific keywords.'],
      };
    });

    recommended.sort((a, b) => b.fitScore - a.fitScore);
    return res.json({ jobs: recommended, job: recommended[0] });
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
      details: err.message,
    });
  }
};
