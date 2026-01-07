const mongoose = require('mongoose');

const UserHistorySchema = new mongoose.Schema(
  {
    history_id: { type: String, unique: true },
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    organization: { type: String },
    date_added: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserHistorySchema.pre('save', async function(next) {
  if (!this.history_id) {
    this.history_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('UserHistory', UserHistorySchema);

