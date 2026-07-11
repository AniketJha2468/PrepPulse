const mongoose = require('mongoose');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const toObjectId = (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(id);
};

const buildPaginationOptions = (query = {}) => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : DEFAULT_PAGE;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildPaginatedResult = (documents, totalCount, page, limit) => {
  const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 0;

  return {
    documents,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const paginateQuery = async (model, filter = {}, options = {}) => {
  const { query = {}, sort = { createdAt: -1 }, projection = '', populate } = options;
  const { page, limit, skip } = buildPaginationOptions(query);

  let mongooseQuery = model.find(filter, projection).sort(sort).skip(skip).limit(limit);

  if (populate) {
    mongooseQuery = mongooseQuery.populate(populate);
  }

  const [documents, totalCount] = await Promise.all([
    mongooseQuery.exec(),
    model.countDocuments(filter),
  ]);

  return buildPaginatedResult(documents, totalCount, page, limit);
};

const documentExists = async (model, filter) => {
  const result = await model.exists(filter);
  return Boolean(result);
};

const escapeRegex = (text = '') => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchFilter = (field, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
    return {};
  }
  return {
    [field]: { $regex: escapeRegex(searchTerm.trim()), $options: 'i' },
  };
};

const sanitizeSortField = (requestedField, allowedFields, fallbackField = 'createdAt') => {
  if (allowedFields.includes(requestedField)) {
    return requestedField;
  }
  return fallbackField;
};

const runInTransaction = async (work) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  isValidObjectId,
  toObjectId,
  buildPaginationOptions,
  buildPaginatedResult,
  paginateQuery,
  documentExists,
  escapeRegex,
  buildSearchFilter,
  sanitizeSortField,
  runInTransaction,
};
