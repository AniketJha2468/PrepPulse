const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
});

const ACCOUNT_STATUS_VALUES = Object.values(ACCOUNT_STATUS);

module.exports = {
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_VALUES,
};
