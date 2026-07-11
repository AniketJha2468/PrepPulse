const mongoose = require('mongoose');

const { NOTIFICATION_TYPE_VALUES } = require('../constants/notificationType.constants');
const { PRIORITY_LEVELS, PRIORITY_LEVEL_VALUES } = require('../constants/priorityLevel.constants');

const NOTIFICATION_CREATOR_TYPES = Object.freeze({
  SYSTEM: 'system',
  ADMIN: 'admin',
  AI: 'ai',
});

const NOTIFICATION_CREATOR_TYPE_VALUES = Object.values(NOTIFICATION_CREATOR_TYPES);

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must be linked to a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [150, 'Notification title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Notification message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: NOTIFICATION_TYPE_VALUES,
        message: '{VALUE} is not a valid notification type',
      },
      required: [true, 'Notification type is required'],
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: String,
      enum: {
        values: NOTIFICATION_CREATOR_TYPE_VALUES,
        message: '{VALUE} is not a valid notification creator',
      },
      default: NOTIFICATION_CREATOR_TYPES.SYSTEM,
      required: true,
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITY_LEVEL_VALUES,
        message: '{VALUE} is not a valid priority level',
      },
      default: PRIORITY_LEVELS.MEDIUM,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
module.exports.NOTIFICATION_CREATOR_TYPES = NOTIFICATION_CREATOR_TYPES;
module.exports.NOTIFICATION_CREATOR_TYPE_VALUES = NOTIFICATION_CREATOR_TYPE_VALUES;
