import mongoose from 'mongoose';

const campaignMetricsSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  spend: {
    type: Number,
    default: 0
  },
  ctr: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
campaignMetricsSchema.index({ campaignId: 1, date: 1 }, { unique: true });

export default mongoose.models.CampaignMetrics || mongoose.model('CampaignMetrics', campaignMetricsSchema);