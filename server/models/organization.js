// models/organization.js
import { Schema, model } from 'mongoose';

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  isActive: { type: Boolean, required: true, default: true },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to update the updatedAt field before saving
organizationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Organization = model('Organization', organizationSchema);

export default Organization;
