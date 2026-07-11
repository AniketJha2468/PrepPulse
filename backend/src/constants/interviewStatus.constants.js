const INTERVIEW_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  EXPIRED: 'expired',
});

const INTERVIEW_STATUS_VALUES = Object.values(INTERVIEW_STATUS);

module.exports = {
  INTERVIEW_STATUS,
  INTERVIEW_STATUS_VALUES,
};
