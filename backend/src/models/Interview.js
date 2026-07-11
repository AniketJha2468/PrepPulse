const mongoose = require('mongoose');

const { INTERVIEW_TYPE_VALUES } = require('../constants/interviewType.constants');
const { DIFFICULTY_LEVEL_VALUES } = require('../constants/difficulty.constants');
const { EXPERIENCE_LEVEL_VALUES } = require('../constants/experienceLevel.constants');
const { INTERVIEW_STATUS, INTERVIEW_STATUS_VALUES } = require('../constants/interviewStatus.constants');
const { AI_MODELS, AI_MODEL_VALUES } = require('../constants/aiModel.constants');
const { generateInterviewId } = require('../utils/interviewIdGenerator');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Interview must be linked to a user'],
      index: true,
    },
    interviewId: {
      type: String,
      required: true,
      unique: true,
      default: generateInterviewId,
      immutable: true,
    },
    title: {
      type: String,
      required: [true, 'Interview title is required'],
      trim: true,
      maxlength: [150, 'Interview title cannot exceed 150 characters'],
    },
    interviewType: {
      type: String,
      enum: {
        values: INTERVIEW_TYPE_VALUES,
        message: '{VALUE} is not a valid interview type',
      },
      required: [true, 'Interview type is required'],
    },
    difficulty: {
      type: String,
      enum: {
        values: DIFFICULTY_LEVEL_VALUES,
        message: '{VALUE} is not a valid difficulty level',
      },
      required: [true, 'Difficulty level is required'],
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [150, 'Job role cannot exceed 150 characters'],
    },
    experienceLevel: {
      type: String,
      enum: {
        values: EXPERIENCE_LEVEL_VALUES,
        message: '{VALUE} is not a valid experience level',
      },
      required: [true, 'Experience level is required'],
    },
    technologies: {
      type: [String],
      default: [],
      set: (technologies) => [...new Set(technologies.map((tech) => tech.trim().toLowerCase()))],
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total number of questions is required'],
      min: [1, 'Total questions must be at least 1'],
      max: [100, 'Total questions cannot exceed 100'],
    },
    completedQuestions: {
      type: Number,
      default: 0,
      min: [0, 'Completed questions cannot be negative'],
      validate: {
        validator: function isWithinTotalQuestions(value) {
          return value <= this.totalQuestions;
        },
        message: 'Completed questions cannot exceed total questions',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Interview duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    status: {
      type: String,
      enum: {
        values: INTERVIEW_STATUS_VALUES,
        message: '{VALUE} is not a valid interview status',
      },
      default: INTERVIEW_STATUS.SCHEDULED,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
      validate: {
        validator: function isAfterStart(value) {
          if (!value || !this.startedAt) {
            return true;
          }
          return value.getTime() >= this.startedAt.getTime();
        },
        message: 'Completion time cannot be earlier than the start time',
      },
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    aiModelUsed: {
      type: String,
      enum: {
        values: AI_MODEL_VALUES,
        message: '{VALUE} is not a supported AI model',
      },
      default: AI_MODELS.GEMINI_1_5_FLASH,
      required: true,
    },
    overallScore: {
      type: Number,
      min: [0, 'Overall score cannot be negative'],
      max: [100, 'Overall score cannot exceed 100'],
      default: null,
    },
    aiSummary: {
      type: String,
      trim: true,
      maxlength: [2000, 'AI summary cannot exceed 2000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ jobRole: 1 });
interviewSchema.index({ interviewType: 1, difficulty: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
