const PRIORITY_LEVELS = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

const PRIORITY_LEVEL_VALUES = Object.values(PRIORITY_LEVELS);

module.exports = {
  PRIORITY_LEVELS,
  PRIORITY_LEVEL_VALUES,
};
