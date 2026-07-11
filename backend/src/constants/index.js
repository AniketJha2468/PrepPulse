const { USER_ROLES, USER_ROLE_VALUES } = require('./roles.constants');
const { ACCOUNT_STATUS, ACCOUNT_STATUS_VALUES } = require('./accountStatus.constants');
const { AUTH_PROVIDERS, AUTH_PROVIDER_VALUES } = require('./authProviders.constants');
const { RESUME_STATUS, RESUME_STATUS_VALUES } = require('./resumeStatus.constants');
const { FILE_TYPES, FILE_TYPE_VALUES } = require('./fileType.constants');
const { DIFFICULTY_LEVELS, DIFFICULTY_LEVEL_VALUES } = require('./difficulty.constants');
const { EXPERIENCE_LEVELS, EXPERIENCE_LEVEL_VALUES } = require('./experienceLevel.constants');
const { INTERVIEW_TYPES, INTERVIEW_TYPE_VALUES } = require('./interviewType.constants');
const { INTERVIEW_STATUS, INTERVIEW_STATUS_VALUES } = require('./interviewStatus.constants');
const { QUESTION_CATEGORIES, QUESTION_CATEGORY_VALUES } = require('./questionCategory.constants');
const {
  ATS_SCORE_LEVELS,
  ATS_SCORE_LEVEL_VALUES,
  ATS_SCORE_THRESHOLDS,
  resolveAtsScoreLevel,
} = require('./atsScore.constants');
const { AI_MODELS, AI_MODEL_VALUES } = require('./aiModel.constants');
const { ANSWER_TYPES, ANSWER_TYPE_VALUES } = require('./answerType.constants');
const { NOTIFICATION_TYPES, NOTIFICATION_TYPE_VALUES } = require('./notificationType.constants');
const { PRIORITY_LEVELS, PRIORITY_LEVEL_VALUES } = require('./priorityLevel.constants');
const { THEMES, THEME_VALUES } = require('./theme.constants');
const { LANGUAGES, LANGUAGE_VALUES } = require('./language.constants');
const { PRIVACY_LEVELS, PRIVACY_LEVEL_VALUES } = require('./privacyLevel.constants');

module.exports = {
  USER_ROLES,
  USER_ROLE_VALUES,
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_VALUES,
  AUTH_PROVIDERS,
  AUTH_PROVIDER_VALUES,
  RESUME_STATUS,
  RESUME_STATUS_VALUES,
  FILE_TYPES,
  FILE_TYPE_VALUES,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LEVEL_VALUES,
  EXPERIENCE_LEVELS,
  EXPERIENCE_LEVEL_VALUES,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_VALUES,
  INTERVIEW_STATUS,
  INTERVIEW_STATUS_VALUES,
  QUESTION_CATEGORIES,
  QUESTION_CATEGORY_VALUES,
  ATS_SCORE_LEVELS,
  ATS_SCORE_LEVEL_VALUES,
  ATS_SCORE_THRESHOLDS,
  resolveAtsScoreLevel,
  AI_MODELS,
  AI_MODEL_VALUES,
  ANSWER_TYPES,
  ANSWER_TYPE_VALUES,
  NOTIFICATION_TYPES,
  NOTIFICATION_TYPE_VALUES,
  PRIORITY_LEVELS,
  PRIORITY_LEVEL_VALUES,
  THEMES,
  THEME_VALUES,
  LANGUAGES,
  LANGUAGE_VALUES,
  PRIVACY_LEVELS,
  PRIVACY_LEVEL_VALUES,
};
