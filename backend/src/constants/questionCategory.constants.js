const QUESTION_CATEGORIES = Object.freeze({
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  SITUATIONAL: 'situational',
  CODING: 'coding',
  SYSTEM_DESIGN: 'system_design',
});

const QUESTION_CATEGORY_VALUES = Object.values(QUESTION_CATEGORIES);

module.exports = {
  QUESTION_CATEGORIES,
  QUESTION_CATEGORY_VALUES,
};
