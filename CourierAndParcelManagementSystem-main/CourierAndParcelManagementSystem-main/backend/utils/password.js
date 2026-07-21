import bcrypt from "bcrypt";

// Number of salt rounds for hashing passwords
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash a plain text password.
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password.
 *
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};