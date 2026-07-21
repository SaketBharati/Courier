import { Parser } from "json2csv";

/**
 * Convert JSON data to CSV.
 *
 * @param {Array<Object>} data - Array of objects to convert.
 * @param {Array<string>} fields - Optional list of fields to include.
 * @returns {string} CSV string.
 */
export const exportToCSV = (data, fields = []) => {
  const parser = new Parser(
    fields.length ? { fields } : {}
  );

  return parser.parse(data);
};