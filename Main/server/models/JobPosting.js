const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema(
  {
    job_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    job_title: { type: String, required: true },
    job_description: { type: String, required: true },
    job_type_tag: { type: [String], default: [] },
    industry_tag: { type: [String], default: [] },
    job_signup_form: { type: String },
    isApproved: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Generate job_id before saving
JobPostingSchema.pre('save', async function(next) {
  if (!this.job_id) {
    this.job_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('JobPosting', JobPostingSchema);

