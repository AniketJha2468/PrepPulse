const NOTIFICATION_TYPES = Object.freeze({
  INTERVIEW_REMINDER: 'interview_reminder',
  FEEDBACK_READY: 'feedback_ready',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system',
  ACCOUNT: 'account',
});

const NOTIFICATION_TYPE_VALUES = Object.values(NOTIFICATION_TYPES);

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_VALUES,
};
