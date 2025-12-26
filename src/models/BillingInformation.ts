import mongoose from 'mongoose';

const BillingInformationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expiration: {
    type: String,
    required: true,
  },
  cvc: {
    type: String,
    required: true,
  },
  cardholderName: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BillingInformation || mongoose.model('BillingInformation', BillingInformationSchema);