const RESUME_STATUS = Object.freeze({
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  PARSED: 'parsed',
  FAILED: 'failed',
  ARCHIVED: 'archived',
});

const RESUME_STATUS_VALUES = Object.values(RESUME_STATUS);

module.exports = {
  RESUME_STATUS,
  RESUME_STATUS_VALUES,
};
