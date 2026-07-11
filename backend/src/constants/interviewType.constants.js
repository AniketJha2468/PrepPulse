const INTERVIEW_TYPES = Object.freeze({
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  SYSTEM_DESIGN: 'system_design',
  HR: 'hr',
  CODING: 'coding',
  MIXED: 'mixed',
});

const INTERVIEW_TYPE_VALUES = Object.values(INTERVIEW_TYPES);

module.exports = {
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_VALUES,
};
