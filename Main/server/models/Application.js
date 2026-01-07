const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    application_id: { type: String, unique: true },
    job_id: { type: String, required: true },
    user_id: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'interview', 'under_review'], default: 'pending' },
    application_data: { type: mongoose.Schema.Types.Mixed },
    why_interested: { type: String, default: '' },
    relevant_skills: { type: String, default: '' },
    hope_to_gain: { type: String, default: '' },
    review_feedback: { type: String },
    interview_date: { type: Date },
    interview_location: { type: String },
    isComplete: { type: Boolean, default: false },
    date_applied: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Generate application_id before saving
ApplicationSchema.pre('save', async function(next) {
  if (!this.application_id) {
    this.application_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);

