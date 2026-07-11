const mongoose = require('mongoose');

const weeklyProgressEntrySchema = new mongoose.Schema(
  {
    weekStartDate: {
      type: Date,
      required: [true, 'Week start date is required'],
    },
    interviewsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Interviews completed cannot be negative'],
    },
    averageScore: {
      type: Number,
      min: [0, 'Average score cannot be negative'],
      max: [100, 'Average score cannot exceed 100'],
      default: 0,
    },
  },
  { _id: false }
);

const monthlyProgressEntrySchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format'],
    },
    interviewsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Interviews completed cannot be negative'],
    },
    averageScore: {
      type: Number,
      min: [0, 'Average score cannot be negative'],
      max: [100, 'Average score cannot exceed 100'],
      default: 0,
    },
  },
  { _id: false }
);

const skillImprovementEntrySchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
    },
    previousScore: {
      type: Number,
      min: [0, 'Previous score cannot be negative'],
      max: [100, 'Previous score cannot exceed 100'],
      default: 0,
    },
    currentScore: {
      type: Number,
      min: [0, 'Current score cannot be negative'],
      max: [100, 'Current score cannot exceed 100'],
      default: 0,
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Progress must be linked to a user'],
      unique: true,
    },
    totalInterviews: {
      type: Number,
      default: 0,
      min: [0, 'Total interviews cannot be negative'],
    },
    averageScore: {
      type: Number,
      min: [0, 'Average score cannot be negative'],
      max: [100, 'Average score cannot exceed 100'],
      default: 0,
    },
    highestScore: {
      type: Number,
      min: [0, 'Highest score cannot be negative'],
      max: [100, 'Highest score cannot exceed 100'],
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: [0, 'Current streak cannot be negative'],
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: [0, 'Longest streak cannot be negative'],
    },
    weeklyProgress: {
      type: [weeklyProgressEntrySchema],
      default: [],
    },
    monthlyProgress: {
      type: [monthlyProgressEntrySchema],
      default: [],
    },
    skillImprovements: {
      type: [skillImprovementEntrySchema],
      default: [],
    },
    weakSkills: {
      type: [String],
      default: [],
      set: (skills) => [...new Set(skills.map((skill) => skill.trim().toLowerCase()))],
    },
    strongSkills: {
      type: [String],
      default: [],
      set: (skills) => [...new Set(skills.map((skill) => skill.trim().toLowerCase()))],
    },
    lastInterviewDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ averageScore: -1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
