import mongoose from 'mongoose';

const peakPricingRuleSchema = new mongoose.Schema({
  parking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  // Conditions
  daysOfWeek: [{
    type: Number, // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    min: 0,
    max: 6,
  }], // empty = all days
  timeRange: {
    start: String, // "HH:mm"
    end: String,
  },
  dateRange: {
    start: Date,
    end: Date,
  }, // if not set, applies every day (subject to daysOfWeek)
  // Pricing adjustment
  adjustmentType: {
    type: String,
    enum: ['fixed', 'percentage'],
    required: true,
  },
  adjustmentValue: {
    type: Number,
    required: true, // fixed amount or percentage
  },
  // For percentage, can be increase (+) or decrease (-)
  priority: {
    type: Number,
    default: 0, // higher priority overrides lower if multiple match
  },
}, {
  timestamps: true,
});

peakPricingRuleSchema.index({ parking: 1 });
peakPricingRuleSchema.index({ parking: 1, enabled: 1 });

const PeakPricingRule = mongoose.model('PeakPricingRule', peakPricingRuleSchema);
export default PeakPricingRule;