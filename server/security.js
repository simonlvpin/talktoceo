const crypto = require("crypto");

const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;
const SCRYPT_COST = 16384;

function requireSecret() {
  const secret = process.env.APP_SECRET || "";
  if (secret.length < 32) {
    throw new Error("APP_SECRET must be at least 32 characters.");
  }
  return secret;
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function validatePassword(password = "") {
  return (
    password.length >= 10
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password)
  );
}

function hashPassword(password, salt = crypto.randomBytes(PASSWORD_SALT_LENGTH).toString("hex")) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, PASSWORD_KEY_LENGTH, { N: SCRYPT_COST }, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        salt,
        passwordHash: derivedKey.toString("hex"),
      });
    });
  });
}

async function verifyPassword(password, user) {
  if (!user?.password_hash || !user?.password_salt) {
    return false;
  }
  const hashed = await hashPassword(password, user.password_salt);
  const a = Buffer.from(hashed.passwordHash, "hex");
  const b = Buffer.from(user.password_hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function encryptionKey() {
  return crypto.createHash("sha256").update(requireSecret()).digest();
}

function encryptJson(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return JSON.stringify({
    v: 1,
    iv: iv.toString("base64"),
    tag: authTag.toString("base64"),
    data: encrypted.toString("base64"),
  });
}

function decryptJson(payload) {
  if (!payload) {
    return null;
  }
  const parsed = JSON.parse(payload);
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(parsed.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(parsed.tag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(parsed.data, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8"));
}

function publicUser(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    theme: row.theme,
    fontSettings: row.font_settings_json ? JSON.parse(row.font_settings_json) : null,
    materialSources: row.material_sources_json ? JSON.parse(row.material_sources_json) : null,
    materialTypes: row.material_types_json ? JSON.parse(row.material_types_json) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

module.exports = {
  decryptJson,
  encryptJson,
  hashPassword,
  normalizeEmail,
  publicUser,
  requireSecret,
  validatePassword,
  verifyPassword,
};
