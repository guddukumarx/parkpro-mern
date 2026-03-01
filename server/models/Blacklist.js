// models/Blacklist.js
import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  parking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure a user can be blacklisted only once per parking
blacklistSchema.index({ parking: 1, user: 1 }, { unique: true });

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;