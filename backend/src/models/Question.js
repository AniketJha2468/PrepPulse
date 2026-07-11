const mongoose = require('mongoose');

const { QUESTION_CATEGORY_VALUES } = require('../constants/questionCategory.constants');
const { DIFFICULTY_LEVEL_VALUES } = require('../constants/difficulty.constants');

const questionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: [true, 'Question must be linked to an interview'],
      index: true,
    },
    questionNumber: {
      type: Number,
      required: [true, 'Question number is required'],
      min: [1, 'Question number must be at least 1'],
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [2000, 'Question text cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: QUESTION_CATEGORY_VALUES,
        message: '{VALUE} is not a valid question category',
      },
      required: [true, 'Question category is required'],
    },
    difficulty: {
      type: String,
      enum: {
        values: DIFFICULTY_LEVEL_VALUES,
        message: '{VALUE} is not a valid difficulty level',
      },
      required: [true, 'Difficulty level is required'],
    },
    expectedAnswer: {
      type: String,
      trim: true,
      maxlength: [5000, 'Expected answer cannot exceed 5000 characters'],
      default: null,
    },
    keywords: {
      type: [String],
      default: [],
      set: (keywords) => [...new Set(keywords.map((keyword) => keyword.trim().toLowerCase()))],
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required'],
      min: [10, 'Time limit must be at least 10 seconds'],
      max: [3600, 'Time limit cannot exceed 3600 seconds'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
      max: [100, 'Marks cannot exceed 100'],
    },
    isAiGenerated: {
      type: Boolean,
      default: true,
    },
    hint: {
      type: String,
      trim: true,
      maxlength: [500, 'Hint cannot exceed 500 characters'],
      default: null,
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: [2000, 'Explanation cannot exceed 2000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ interview: 1, questionNumber: 1 }, { unique: true });
questionSchema.index({ category: 1 });
questionSchema.index({ difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
