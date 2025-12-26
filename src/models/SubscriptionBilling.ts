import mongoose from 'mongoose';

const SubscriptionBillingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
    enum: ['Free', 'Pro', 'Elite'],
  },
  planPrice: {
    type: String,
    required: true,
  },
  planExpiryDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  selectedAt: {
    type: Date,
    default: Date.now,
  },
  stripeSessionId: {
    type: String,
    required: false,
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  stripeSubscriptionId: {
    type: String,
    required: false,
  },
});

// Clear existing model to force refresh
if (mongoose.models.SubscriptionBilling) {
  delete mongoose.models.SubscriptionBilling;
}

export default mongoose.model('SubscriptionBilling', SubscriptionBillingSchema);