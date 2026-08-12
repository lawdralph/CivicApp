const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  photoUrl: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },
  location: {
    type: locationSchema,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'under_review', 'in_progress', 'resolved', 'rejected'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
