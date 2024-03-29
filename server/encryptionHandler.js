const crypto = require("crypto");
const secret = "6fa979f20126cb08aa645a8f495f6d85"; //random encryption key
const salt = "7777777a72ddc2f1"; //random initialization vector

/**
 * function for text encryption wit aes-256-cbc method
 * @param {*} plain - plain text to be encrypted
 * @returns encrypted text
 */
const encrypt = (plain) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", secret, salt);
  let encrypted = cipher.update(plain, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

/**
 * function for reverting text encryption wit aes-256-cbc method
 * @param {*} encrypted - encrypted text
 * @returns plain text
 */
const decrypt = (encrypted) => {
  encrypted = encrypted.toString();
  let decipher = crypto.createDecipheriv("aes-256-cbc", secret, salt);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};

module.exports = {
  encrypt,
  decrypt,
};
