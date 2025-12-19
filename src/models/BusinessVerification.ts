import mongoose from 'mongoose';

const BusinessVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BusinessVerification || mongoose.model('BusinessVerification', BusinessVerificationSchema);