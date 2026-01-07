const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema(
  {
    skill_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    skill_name: { type: String, required: true },
    proficiency_level: { type: String },
    date_added: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserSkillSchema.pre('save', async function(next) {
  if (!this.skill_id) {
    this.skill_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('UserSkill', UserSkillSchema);

