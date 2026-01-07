const mongoose = require('mongoose');

const UserAchievementSchema = new mongoose.Schema(
  {
    achievement_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    achievement_name: { type: String, required: true },
    description: { type: String },
    date_earned: { type: Date },
    issuer: { type: String },
    date_added: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserAchievementSchema.pre('save', async function(next) {
  if (!this.achievement_id) {
    this.achievement_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('UserAchievement', UserAchievementSchema);

