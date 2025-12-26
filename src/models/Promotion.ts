import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  choosePromotionType: {
    type: String,
    required: true
  },
  promotionTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  materialSelection: {
    type: String,
    required: false
  },
  bonusType: {
    type: String,
    enum: ['flat', 'percentage'],
    required: true
  },
  bonusValue: {
    type: String,
    required: true
  },
  termsConditions: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dailyRedemptionCap: {
    type: Number,
    required: true
  },
  totalBudgetCap: {
    type: Number,
    required: true
  },
  autoPauseWhenBudgetReached: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'expired', 'draft'],
    default: 'draft'
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  currentSpend: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);