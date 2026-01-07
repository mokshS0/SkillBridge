const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, unique: true },
    real_name: { type: String, required: true },
    personal_email: { type: String, required: true, unique: true },
    phone_number: { type: String },
    birth_date: { type: Date },
    school_name: { type: String },
    school_district: { type: String },
    school_email: { type: String },
    account_username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_teacher: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    city: { type: String },
    state: { type: String },
    bio: { type: String },
    profile_img_url: { type: String, default: 'https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg' },
    avatar_name: { type: String },
    created_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Generate user_id before saving
UserSchema.pre('save', async function(next) {
  if (!this.user_id) {
    this.user_id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
