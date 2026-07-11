const ATS_SCORE_LEVELS = Object.freeze({
  POOR: 'poor',
  AVERAGE: 'average',
  GOOD: 'good',
  EXCELLENT: 'excellent',
});

const ATS_SCORE_LEVEL_VALUES = Object.values(ATS_SCORE_LEVELS);

const ATS_SCORE_THRESHOLDS = Object.freeze({
  EXCELLENT_MIN: 85,
  GOOD_MIN: 70,
  AVERAGE_MIN: 50,
});

/**
 * Resolves a numeric ATS score into a qualitative score level.
 * @param {number} score - A score between 0 and 100.
 * @returns {string} One of ATS_SCORE_LEVELS.
 */
const resolveAtsScoreLevel = (score) => {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return null;
  }
  if (score >= ATS_SCORE_THRESHOLDS.EXCELLENT_MIN) {
    return ATS_SCORE_LEVELS.EXCELLENT;
  }
  if (score >= ATS_SCORE_THRESHOLDS.GOOD_MIN) {
    return ATS_SCORE_LEVELS.GOOD;
  }
  if (score >= ATS_SCORE_THRESHOLDS.AVERAGE_MIN) {
    return ATS_SCORE_LEVELS.AVERAGE;
  }
  return ATS_SCORE_LEVELS.POOR;
};

module.exports = {
  ATS_SCORE_LEVELS,
  ATS_SCORE_LEVEL_VALUES,
  ATS_SCORE_THRESHOLDS,
  resolveAtsScoreLevel,
};
