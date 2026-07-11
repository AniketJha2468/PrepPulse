const mongoose = require('mongoose');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Checks whether a given value is a valid MongoDB ObjectId.
 * @param {*} id - The value to validate.
 * @returns {boolean}
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Converts a value into a Mongoose ObjectId instance.
 * Returns null if the value is not a valid ObjectId.
 * @param {*} id - The value to convert.
 * @returns {mongoose.Types.ObjectId|null}
 */
const toObjectId = (id) => {
  if (!isValidObjectId(id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(id);
};

/**
 * Normalizes and validates pagination parameters from a request query.
 * @param {Object} query - The raw query object (e.g. req.query).
 * @param {number} [query.page] - Requested page number.
 * @param {number} [query.limit] - Requested page size.
 * @returns {{ page: number, limit: number, skip: number }}
 */
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

/**
 * Builds a paginated response payload with consistent metadata.
 * @param {Array} documents - The documents returned for the current page.
 * @param {number} totalCount - Total number of matching documents.
 * @param {number} page - Current page number.
 * @param {number} limit - Page size.
 * @returns {{ documents: Array, meta: Object }}
 */
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

/**
 * Executes a paginated query against a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to query.
 * @param {Object} [filter={}] - MongoDB filter object.
 * @param {Object} [options={}] - Additional options.
 * @param {Object} [options.query={}] - Raw pagination query (page, limit).
 * @param {Object|string} [options.sort={ createdAt: -1 }] - Sort specification.
 * @param {string} [options.projection=''] - Field projection string.
 * @param {string|Array} [options.populate] - Population configuration.
 * @returns {Promise<{ documents: Array, meta: Object }>}
 */
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

/**
 * Checks whether a document matching the given filter exists.
 * @param {mongoose.Model} model - The Mongoose model to query.
 * @param {Object} filter - MongoDB filter object.
 * @returns {Promise<boolean>}
 */
const documentExists = async (model, filter) => {
  const result = await model.exists(filter);
  return Boolean(result);
};

/**
 * Escapes special regex characters in a string so it can be safely used
 * inside a MongoDB regex query.
 * @param {string} text - The raw text to escape.
 * @returns {string}
 */
const escapeRegex = (text = '') => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Builds a case-insensitive partial-match regex filter for a given field.
 * @param {string} field - The schema field to search against.
 * @param {string} searchTerm - The raw search term provided by the user.
 * @returns {Object} A MongoDB filter fragment, or an empty object if no term.
 */
const buildSearchFilter = (field, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
    return {};
  }
  return {
    [field]: { $regex: escapeRegex(searchTerm.trim()), $options: 'i' },
  };
};

/**
 * Restricts a requested sort field to an allow-list to prevent
 * arbitrary/unsafe sort injection, falling back to a safe default.
 * @param {string} requestedField - The field the client asked to sort by.
 * @param {string[]} allowedFields - Fields permitted for sorting.
 * @param {string} [fallbackField='createdAt'] - Default field if invalid.
 * @returns {string}
 */
const sanitizeSortField = (requestedField, allowedFields, fallbackField = 'createdAt') => {
  if (allowedFields.includes(requestedField)) {
    return requestedField;
  }
  return fallbackField;
};

/**
 * Wraps a Mongoose session in a transaction, automatically committing
 * on success and aborting on failure.
 * @param {Function} work - An async function receiving the active session.
 * @returns {Promise<*>} The return value of the work function.
 */
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
