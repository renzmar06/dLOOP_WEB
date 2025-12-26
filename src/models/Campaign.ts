import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  boostType: {
    type: String,
    enum: ['business-profile', 'promotion', 'map-pin', 'social-post', 'campaign-manager'],
    required: true
  },
  dailyBudget: {
    type: Number,
    required: true,
    min: 5
  },
  durationDays: {
    type: Number,
    required: true,
    min: 1
  },
  isContinuous: {
    type: Boolean,
    default: false
  },
  audienceType: {
    type: String,
    enum: ['local', 'targeted', 'broad'],
    required: true
  },
  radiusKm: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  totalBudget: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Clear model cache to ensure schema updates are applied
if (mongoose.models.Campaign) {
  delete mongoose.models.Campaign;
}

export default mongoose.model('Campaign', campaignSchema);