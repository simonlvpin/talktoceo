const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { hashPassword, normalizeEmail } = require("./security");

const DEFAULT_DB_PATH = path.join(__dirname, "..", "data", "wistalk.sqlite");

function now() {
  return new Date().toISOString();
}

function json(value) {
  return JSON.stringify(value ?? null);
}

function openDatabase() {
  const dbPath = path.resolve(process.env.DATABASE_PATH || DEFAULT_DB_PATH);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA busy_timeout = 5000");
  migrate(db);
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      email_key TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'pending',
      password_hash TEXT,
      password_salt TEXT,
      theme TEXT NOT NULL DEFAULT 'clarity-teal',
      font_settings_json TEXT,
      material_sources_json TEXT,
      material_types_json TEXT,
      model_settings_encrypted TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT,
      password_changed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      source_name TEXT,
      source_id TEXT,
      type_name TEXT,
      type_id TEXT,
      category_id TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      raw_text TEXT NOT NULL DEFAULT '',
      analysis_json TEXT,
      skill_version TEXT,
      favorite INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_user_id, deleted_at, updated_at);

    CREATE TABLE IF NOT EXISTS material_files (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER NOT NULL,
      content BLOB NOT NULL,
      sha256 TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pending_uploads (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS generated_articles (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      topic_row_id TEXT,
      payload_json TEXT NOT NULL,
      deleted_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doc_categories (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      is_preset INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      event_type TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      ip TEXT,
      user_agent TEXT,
      detail_json TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

async function ensureAdmin(db) {
  const adminEmail = process.env.ADMIN_EMAIL || "Simon.Lv@fanruan.com";
  const emailKey = normalizeEmail(adminEmail);
  const exists = db.prepare("SELECT id FROM users WHERE email_key = ?").get(emailKey);
  if (exists) {
    return;
  }
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "ChangeMe-2026!";
  const password = await hashPassword(initialPassword);
  const timestamp = now();
  db.prepare(`
    INSERT INTO users (
      id, email, email_key, role, status, password_hash, password_salt,
      font_settings_json, material_sources_json, material_types_json,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, 'admin', 'active', ?, ?, ?, ?, ?, ?, ?
    )
  `).run(
    cryptoRandomId(),
    adminEmail,
    emailKey,
    password.passwordHash,
    password.salt,
    json({ presetId: "small", bodySize: "15px", buttonSize: "14px", titleSize: "24px" }),
    json([{ id: "source-ceo-marks", name: "CEO Marks", isPreset: true }]),
    json([
      { id: "type-executive-view", name: "高层视角", isPreset: true },
      { id: "type-meeting-notes", name: "会议纪要", isPreset: true },
      { id: "type-training-speech", name: "培训讲话", isPreset: true },
    ]),
    timestamp,
    timestamp,
  );
}

function cryptoRandomId(prefix = "") {
  const crypto = require("crypto");
  return `${prefix}${crypto.randomUUID()}`;
}

module.exports = {
  cryptoRandomId,
  ensureAdmin,
  json,
  now,
  openDatabase,
};
