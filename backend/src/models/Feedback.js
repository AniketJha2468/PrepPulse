const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Feedback must be linked to a user'],
      index: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: [true, 'Feedback must be linked to an interview'],
      unique: true,
    },
    overallScore: {
      type: Number,
      min: [0, 'Overall score cannot be negative'],
      max: [100, 'Overall score cannot exceed 100'],
      default: null,
    },
    technicalScore: {
      type: Number,
      min: [0, 'Technical score cannot be negative'],
      max: [100, 'Technical score cannot exceed 100'],
      default: null,
    },
    communicationScore: {
      type: Number,
      min: [0, 'Communication score cannot be negative'],
      max: [100, 'Communication score cannot exceed 100'],
      default: null,
    },
    confidenceScore: {
      type: Number,
      min: [0, 'Confidence score cannot be negative'],
      max: [100, 'Confidence score cannot exceed 100'],
      default: null,
    },
    problemSolvingScore: {
      type: Number,
      min: [0, 'Problem solving score cannot be negative'],
      max: [100, 'Problem solving score cannot exceed 100'],
      default: null,
    },
    behaviourScore: {
      type: Number,
      min: [0, 'Behaviour score cannot be negative'],
      max: [100, 'Behaviour score cannot exceed 100'],
      default: null,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    aiSuggestions: {
      type: [String],
      default: [],
    },
    recommendedTopics: {
      type: [String],
      default: [],
    },
    finalSummary: {
      type: String,
      trim: true,
      maxlength: [3000, 'Final summary cannot exceed 3000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ user: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
