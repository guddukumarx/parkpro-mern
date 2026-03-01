import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['welcome', 'bookingConfirmed', 'bookingCancelled', 'forgotPassword'],
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  description: String,
  variables: [String], // e.g., ['name', 'bookingId', ...]
}, {
  timestamps: true,
});

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
export default EmailTemplate;