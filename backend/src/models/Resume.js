const mongoose = require('mongoose');

const { RESUME_STATUS, RESUME_STATUS_VALUES } = require('../constants/resumeStatus.constants');
const { FILE_TYPE_VALUES } = require('../constants/fileType.constants');
const { resolveAtsScoreLevel } = require('../constants/atsScore.constants');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const educationEntrySchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
      maxlength: [200, 'Institution name cannot exceed 200 characters'],
    },
    degree: {
      type: String,
      trim: true,
      maxlength: [150, 'Degree cannot exceed 150 characters'],
      default: null,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [150, 'Field of study cannot exceed 150 characters'],
      default: null,
    },
    startYear: {
      type: Number,
      min: [1950, 'Start year must be realistic'],
      max: [2100, 'Start year must be realistic'],
      default: null,
    },
    endYear: {
      type: Number,
      min: [1950, 'End year must be realistic'],
      max: [2100, 'End year must be realistic'],
      default: null,
    },
    grade: {
      type: String,
      trim: true,
      maxlength: [50, 'Grade cannot exceed 50 characters'],
      default: null,
    },
  },
  { _id: false }
);

const experienceEntrySchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [150, 'Role cannot exceed 150 characters'],
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null,
    },
  },
  { _id: false }
);

const projectEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Project title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Project description cannot exceed 1000 characters'],
      default: null,
    },
    technologies: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const certificationEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
      maxlength: [200, 'Certification name cannot exceed 200 characters'],
    },
    issuingOrganization: {
      type: String,
      trim: true,
      maxlength: [200, 'Issuing organization cannot exceed 200 characters'],
      default: null,
    },
    issueDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resume must be linked to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      maxlength: [150, 'Resume title cannot exceed 150 characters'],
    },
    fileUrl: {
      type: String,
      required: [true, 'Resume file URL is required'],
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: null,
    },
    fileType: {
      type: String,
      enum: {
        values: FILE_TYPE_VALUES,
        message: '{VALUE} is not a supported file type',
      },
      required: [true, 'File type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be greater than 0 bytes'],
      max: [MAX_FILE_SIZE_BYTES, 'File size cannot exceed 10 MB'],
    },
    atsScore: {
      type: Number,
      min: [0, 'ATS score cannot be negative'],
      max: [100, 'ATS score cannot exceed 100'],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: RESUME_STATUS_VALUES,
        message: '{VALUE} is not a valid resume status',
      },
      default: RESUME_STATUS.UPLOADED,
      required: true,
      index: true,
    },
    parsedSkills: {
      type: [String],
      default: [],
      set: (skills) => [...new Set(skills.map((skill) => skill.trim().toLowerCase()))],
    },
    parsedEducation: {
      type: [educationEntrySchema],
      default: [],
    },
    parsedExperience: {
      type: [experienceEntrySchema],
      default: [],
    },
    parsedProjects: {
      type: [projectEntrySchema],
      default: [],
    },
    parsedCertifications: {
      type: [certificationEntrySchema],
      default: [],
    },
    parsedAchievements: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
      default: null,
    },
    aiSuggestions: {
      type: [String],
      default: [],
    },
    uploadedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    version: {
      type: Number,
      required: true,
      min: [1, 'Version must be at least 1'],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1, version: 1 }, { unique: true });
resumeSchema.index({ user: 1, createdAt: -1 });

resumeSchema.virtual('atsScoreLevel').get(function getAtsScoreLevel() {
  return resolveAtsScoreLevel(this.atsScore);
});

resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
