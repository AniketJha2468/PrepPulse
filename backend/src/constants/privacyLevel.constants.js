const PRIVACY_LEVELS = Object.freeze({
  PUBLIC: 'public',
  PRIVATE: 'private',
  CONNECTIONS_ONLY: 'connections_only',
});

const PRIVACY_LEVEL_VALUES = Object.values(PRIVACY_LEVELS);

module.exports = {
  PRIVACY_LEVELS,
  PRIVACY_LEVEL_VALUES,
};
