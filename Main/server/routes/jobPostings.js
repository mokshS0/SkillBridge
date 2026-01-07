const express = require('express');
const router = express.Router();

const JobPosting = require('../models/JobPosting');
const auth = require('../middleware/auth');

// GET /job_postings
router.get('/', auth, async (req, res) => {
  try {
    const { approved } = req.query;
    let query = {};
    
    if (approved !== undefined) {
      query.isApproved = approved === 'true';
    }

    const jobPostings = await JobPosting.find(query).sort({ date_created: -1 });
    res.json(jobPostings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /job_postings/pending
router.get('/pending', auth, async (req, res) => {
  try {
    const jobPostings = await JobPosting.find({ isApproved: false }).sort({ date_created: -1 });
    res.json(jobPostings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /job_postings/:jobId
router.get('/:jobId', auth, async (req, res) => {
  try {
    const jobPosting = await JobPosting.findOne({ job_id: req.params.jobId });
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /job_postings
router.post('/', auth, async (req, res) => {
  try {
    const {
      user_id,
      job_title,
      job_description,
      job_type_tag,
      industry_tag,
      job_signup_form
    } = req.body;

    const newJobPosting = new JobPosting({
      user_id: user_id || req.user.user_id,
      job_title,
      job_description,
      job_type_tag: job_type_tag || [],
      industry_tag: industry_tag || [],
      job_signup_form: job_signup_form || '',
      isApproved: false
    });

    const jobPosting = await newJobPosting.save();
    res.status(201).json(jobPosting);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /job_postings/:jobId
router.put('/:jobId', auth, async (req, res) => {
  try {
    const jobPosting = await JobPosting.findOne({ job_id: req.params.jobId });
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        jobPosting[key] = req.body[key];
      }
    });

    await jobPosting.save();
    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /job_postings/:jobId/toggle-approval
router.put('/:jobId/toggle-approval', auth, async (req, res) => {
  try {
    const jobPosting = await JobPosting.findOne({ job_id: req.params.jobId });
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    jobPosting.isApproved = !jobPosting.isApproved;
    await jobPosting.save();
    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /job_postings/:jobId
router.delete('/:jobId', auth, async (req, res) => {
  try {
    const jobPosting = await JobPosting.findOne({ job_id: req.params.jobId });
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    await JobPosting.deleteOne({ job_id: req.params.jobId });
    res.json({ message: 'Job posting deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

