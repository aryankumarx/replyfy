/**
 * E2E Encryption Utility
 * Uses AES-256-CBC for encrypting/decrypting messages between mobile app and backend.
 * The shared secret is derived from the APP_API_KEY using SHA-256.
 * 
 * This ensures that even if someone intercepts the HTTPS traffic (MITM),
 * they cannot read the actual message content without the shared key.
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size

/**
 * Derive a 32-byte encryption key from the APP_API_KEY
 */
function getEncryptionKey() {
  const secret = process.env.APP_API_KEY || 'default-fallback-key';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt plaintext → returns "iv:encryptedData" in hex
 */
function encrypt(text) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt "iv:encryptedData" → returns plaintext
 */
function decrypt(encryptedText) {
  const key = getEncryptionKey();
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
