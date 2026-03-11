/**
 * Normalizes the search query parameter.
 *
 * Example:
 *   GET /leads?search=smith
 *
 * This function guarantees a string result and removes
 * unnecessary whitespace.
 *
 * Returning an empty string signals the query layer
 * that no search filter should be applied.
 */
export function parseSearch(query) {
  if (typeof query.search !== 'string') return '';

  const trimmedSearchValue = query.search.trim();

  // Empty strings are treated as no search
  return trimmedSearchValue === '' ? '' : trimmedSearchValue;
}
