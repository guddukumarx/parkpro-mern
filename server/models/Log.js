// models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info',
    },
    message: String,
    meta: mongoose.Schema.Types.Mixed,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model('Log', logSchema);
export default Log;