const mongoose = require('mongoose');

const UserProjectSchema = new mongoose.Schema(
  {
    project_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    project_name: { type: String, required: true },
    project_description: { type: String },
    project_url: { type: String },
    technologies_used: { type: [String], default: [] },
    date_created: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserProjectSchema.pre('save', async function(next) {
  if (!this.project_id) {
    this.project_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('UserProject', UserProjectSchema);

