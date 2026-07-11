const AI_MODELS = Object.freeze({
  GEMINI_PRO: 'gemini-pro',
  GEMINI_1_5_PRO: 'gemini-1.5-pro',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash',
});

const AI_MODEL_VALUES = Object.values(AI_MODELS);

module.exports = {
  AI_MODELS,
  AI_MODEL_VALUES,
};
