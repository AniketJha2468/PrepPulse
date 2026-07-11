const mongoose = require('mongoose');

const { ANSWER_TYPE_VALUES } = require('../constants/answerType.constants');

const responseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Response must be linked to a user'],
      index: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: [true, 'Response must be linked to an interview'],
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'Response must be linked to a question'],
      index: true,
    },
    answerText: {
      type: String,
      trim: true,
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
      default: null,
    },
    answerType: {
      type: String,
      enum: {
        values: ANSWER_TYPE_VALUES,
        message: '{VALUE} is not a valid answer type',
      },
      required: [true, 'Answer type is required'],
    },
    timeTaken: {
      type: Number,
      required: [true, 'Time taken is required'],
      min: [0, 'Time taken cannot be negative'],
    },
    aiScore: {
      type: Number,
      min: [0, 'AI score cannot be negative'],
      max: [100, 'AI score cannot exceed 100'],
      default: null,
    },
    confidenceScore: {
      type: Number,
      min: [0, 'Confidence score cannot be negative'],
      max: [100, 'Confidence score cannot exceed 100'],
      default: null,
    },
    keywordsMatched: {
      type: [String],
      default: [],
      set: (keywords) => [...new Set(keywords.map((keyword) => keyword.trim().toLowerCase()))],
    },
    missingKeywords: {
      type: [String],
      default: [],
      set: (keywords) => [...new Set(keywords.map((keyword) => keyword.trim().toLowerCase()))],
    },
    grammarScore: {
      type: Number,
      min: [0, 'Grammar score cannot be negative'],
      max: [100, 'Grammar score cannot exceed 100'],
      default: null,
    },
    fluencyScore: {
      type: Number,
      min: [0, 'Fluency score cannot be negative'],
      max: [100, 'Fluency score cannot exceed 100'],
      default: null,
    },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

responseSchema.index({ interview: 1, question: 1 }, { unique: true });
responseSchema.index({ user: 1, createdAt: -1 });

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
