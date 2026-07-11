const AUTH_PROVIDERS = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
});

const AUTH_PROVIDER_VALUES = Object.values(AUTH_PROVIDERS);

module.exports = {
  AUTH_PROVIDERS,
  AUTH_PROVIDER_VALUES,
};
