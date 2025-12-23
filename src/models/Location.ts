import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User'
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String },
  hours: { type: String },
  materials: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  managers: [{ type: String }],
  checkIns: { type: Number, default: 0 },
  redemptions: { type: Number, default: 0 },
  payouts: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', locationSchema);