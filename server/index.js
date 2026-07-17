require("dotenv").config();

const crypto = require("crypto");
const dns = require("dns").promises;
const net = require("net");
const path = require("path");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const multer = require("multer");

const { requireAdmin, requireAuth, signToken } = require("./auth");
const { cryptoRandomId, ensureAdmin, json, now, openDatabase } = require("./db");
const {
  decryptJson,
  encryptJson,
  hashPassword,
  normalizeEmail,
  publicUser,
  validatePassword,
  verifyPassword,
} = require("./security");

const app = express();
const db = openDatabase();

const PORT = Number(process.env.PORT || 8787);
const MAX_UPLOAD_FILES = Number(process.env.MAX_UPLOAD_FILES || 10);
const MAX_UPLOAD_FILE_SIZE = Number(process.env.MAX_UPLOAD_FILE_SIZE_MB || 50) * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_UPLOAD_FILES,
    fileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

function allowedOrigins() {
  return String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function audit(req, eventType, detail = {}) {
  const getHeader = typeof req.get === "function" ? req.get.bind(req) : () => "";
  const userAgent = getHeader("user-agent") || null;
  db.prepare(`
    INSERT INTO audit_events (
      id, actor_user_id, event_type, target_type, target_id, ip, user_agent, detail_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    cryptoRandomId("evt_"),
    req.user?.id || null,
    eventType,
    detail.targetType || null,
    detail.targetId || null,
    req.ip || null,
    userAgent,
    json(detail),
    now(),
  );
}

function canReadDocument(user, document) {
  return user.role === "admin" || document.owner_user_id === user.id;
}

function parseBodyJson(value, fallback = null) {
  if (typeof value === "string" && value.trim()) {
    return JSON.parse(value);
  }
  return value ?? fallback;
}

function randomPassword() {
  return `${crypto.randomBytes(9).toString("base64url")}aA1!`;
}

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

const origins = allowedOrigins();
if (origins.length) {
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS origin is not allowed."));
    },
    credentials: true,
  }));
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "wistalk-api", time: now() });
});

app.post("/api/url/extract", async (req, res) => {
  try {
    const targetUrl = normalizeArticleUrl(req.body.url);
    if (isKmsUrl(targetUrl, req.body.kms?.host)) {
      const article = await fetchKmsArticle(targetUrl, req.body.kms || {});
      if ((article.rawText || "").length < 100) {
        res.status(422).json({ error: "ARTICLE_TEXT_TOO_SHORT", message: "KMS 已返回，但没有解析到足够正文内容。" });
        return;
      }
      res.json(article);
      return;
    }
    await assertPublicHttpUrl(targetUrl);
    const response = await fetchPublicUrl(targetUrl);
    if (!response.ok) {
      res.status(400).json({ error: "URL_FETCH_FAILED", message: `目标页面返回 HTTP ${response.status}` });
      return;
    }
    const contentType = response.headers.get("content-type") || "";
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(contentType)) {
      res.status(400).json({ error: "UNSUPPORTED_CONTENT_TYPE", message: `URL 返回的不是网页正文：${contentType || "未知类型"}` });
      return;
    }
    const body = await response.text();
    const article = /text\/plain/i.test(contentType)
      ? { title: titleFromUrl(targetUrl), rawText: normalizeWhitespace(body) }
      : extractArticleFromHtml(body, targetUrl);
    if ((article.rawText || "").length < 100) {
      res.status(422).json({ error: "ARTICLE_TEXT_TOO_SHORT", message: "没有解析到足够正文内容，目标页面可能需要登录或使用了脚本渲染。" });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: "URL_EXTRACT_FAILED", message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const emailKey = normalizeEmail(req.body.email);
  const user = db.prepare("SELECT * FROM users WHERE email_key = ?").get(emailKey);
  if (!user || user.status !== "active" || !(await verifyPassword(String(req.body.password || ""), user))) {
    res.status(401).json({ error: "INVALID_CREDENTIALS" });
    return;
  }
  db.prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?").run(now(), now(), user.id);
  const refreshed = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
  audit({ ...req, user: refreshed }, "login");
  res.json({ token: signToken(refreshed), user: publicUser(refreshed) });
});

app.get("/api/auth/me", requireAuth(db), (req, res) => {
  const settings = req.user.model_settings_encrypted ? decryptJson(req.user.model_settings_encrypted) : null;
  res.json({ user: req.publicUser, modelSettings: settings });
});

app.post("/api/auth/change-password", requireAuth(db), async (req, res) => {
  const oldPassword = String(req.body.oldPassword || "");
  const newPassword = String(req.body.newPassword || "");
  if (!(await verifyPassword(oldPassword, req.user))) {
    res.status(400).json({ error: "OLD_PASSWORD_INCORRECT" });
    return;
  }
  if (!validatePassword(newPassword)) {
    res.status(400).json({ error: "WEAK_PASSWORD" });
    return;
  }
  const hashed = await hashPassword(newPassword);
  db.prepare(`
    UPDATE users
    SET password_hash = ?, password_salt = ?, password_changed_at = ?, updated_at = ?
    WHERE id = ?
  `).run(hashed.passwordHash, hashed.salt, now(), now(), req.user.id);
  audit(req, "change_password");
  res.json({ ok: true });
});

app.get("/api/admin/users", requireAuth(db), requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  res.json({ users: rows.map(publicUser) });
});

app.post("/api/admin/users", requireAuth(db), requireAdmin, async (req, res) => {
  const email = String(req.body.email || "").trim();
  const emailKey = normalizeEmail(email);
  if (!emailKey.endsWith("@fanruan.com")) {
    res.status(400).json({ error: "EMAIL_NOT_ALLOWED" });
    return;
  }
  const exists = db.prepare("SELECT id FROM users WHERE email_key = ?").get(emailKey);
  if (exists) {
    res.status(409).json({ error: "USER_EXISTS" });
    return;
  }
  const password = req.body.password && validatePassword(req.body.password)
    ? String(req.body.password)
    : randomPassword();
  const hashed = await hashPassword(password);
  const timestamp = now();
  const id = cryptoRandomId("usr_");
  db.prepare(`
    INSERT INTO users (
      id, email, email_key, role, status, password_hash, password_salt,
      font_settings_json, material_sources_json, material_types_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    email,
    emailKey,
    req.body.role === "admin" ? "admin" : "user",
    hashed.passwordHash,
    hashed.salt,
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
  audit(req, "admin_create_user", { targetType: "user", targetId: id, email });
  res.status(201).json({ user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id)), password });
});

app.post("/api/admin/users/:id/reset-password", requireAuth(db), requireAdmin, async (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) {
    res.status(404).json({ error: "USER_NOT_FOUND" });
    return;
  }
  const password = randomPassword();
  const hashed = await hashPassword(password);
  db.prepare(`
    UPDATE users
    SET password_hash = ?, password_salt = ?, password_changed_at = NULL, updated_at = ?
    WHERE id = ?
  `).run(hashed.passwordHash, hashed.salt, now(), user.id);
  audit(req, "admin_reset_password", { targetType: "user", targetId: user.id });
  res.json({ user: publicUser({ ...user, updated_at: now() }), password });
});

app.get("/api/settings", requireAuth(db), (req, res) => {
  res.json({
    user: req.publicUser,
    modelSettings: req.user.model_settings_encrypted ? decryptJson(req.user.model_settings_encrypted) : null,
  });
});

app.put("/api/settings", requireAuth(db), (req, res) => {
  const {
    theme,
    fontSettings,
    materialSources,
    materialTypes,
    modelSettings,
  } = req.body;
  db.prepare(`
    UPDATE users
    SET theme = COALESCE(?, theme),
        font_settings_json = COALESCE(?, font_settings_json),
        material_sources_json = COALESCE(?, material_sources_json),
        material_types_json = COALESCE(?, material_types_json),
        model_settings_encrypted = COALESCE(?, model_settings_encrypted),
        updated_at = ?
    WHERE id = ?
  `).run(
    theme || null,
    fontSettings ? json(fontSettings) : null,
    materialSources ? json(materialSources) : null,
    materialTypes ? json(materialTypes) : null,
    modelSettings ? encryptJson(modelSettings) : null,
    now(),
    req.user.id,
  );
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  audit(req, "update_settings");
  res.json({
    user: publicUser(updated),
    modelSettings: updated.model_settings_encrypted ? decryptJson(updated.model_settings_encrypted) : null,
  });
});

app.get("/api/documents", requireAuth(db), (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true" && req.user.role === "admin";
  const rows = req.user.role === "admin"
    ? db.prepare(`SELECT * FROM documents WHERE (? = 1 OR deleted_at IS NULL) ORDER BY updated_at DESC`).all(includeDeleted ? 1 : 0)
    : db.prepare(`SELECT * FROM documents WHERE owner_user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC`).all(req.user.id);
  res.json({ documents: rows.map(documentResponse) });
});

app.get("/api/documents/:id", requireAuth(db), (req, res) => {
  const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!row || !canReadDocument(req.user, row)) {
    res.status(404).json({ error: "DOCUMENT_NOT_FOUND" });
    return;
  }
  res.json({ document: documentResponse(row) });
});

app.post("/api/documents/upload", requireAuth(db), upload.array("files", MAX_UPLOAD_FILES), (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    res.status(400).json({ error: "NO_FILES" });
    return;
  }
  const metadata = parseBodyJson(req.body.metadata, {});
  const timestamp = now();
  const created = [];
  const createDocument = db.transaction(() => {
    for (const file of files) {
      const id = cryptoRandomId("doc_");
      const title = metadata.title || file.originalname.replace(/\.[^.]+$/, "");
      const rawText = metadata.rawTextByFile?.[file.originalname] || metadata.rawText || "";
      db.prepare(`
        INSERT INTO documents (
          id, owner_user_id, title, source_name, source_id, type_name, type_id,
          category_id, tags_json, raw_text, analysis_json, skill_version, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        req.user.id,
        title,
        metadata.sourceName || "",
        metadata.sourceId || "",
        metadata.typeName || "",
        metadata.typeId || "",
        metadata.categoryId || "",
        json(metadata.tags || []),
        rawText,
        metadata.analysis ? json(metadata.analysis) : null,
        metadata.skillVersion || "",
        timestamp,
        timestamp,
      );

      const fileId = cryptoRandomId("file_");
      db.prepare(`
        INSERT INTO material_files (
          id, document_id, original_name, mime_type, size_bytes, content, sha256, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fileId,
        id,
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
        crypto.createHash("sha256").update(file.buffer).digest("hex"),
        timestamp,
      );
      created.push(documentResponse(db.prepare("SELECT * FROM documents WHERE id = ?").get(id)));
    }
  });
  createDocument();
  audit(req, "upload_documents", { count: created.length });
  res.status(201).json({ documents: created });
});

app.put("/api/documents/:id", requireAuth(db), (req, res) => {
  const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!row || !canReadDocument(req.user, row)) {
    res.status(404).json({ error: "DOCUMENT_NOT_FOUND" });
    return;
  }
  const ownerGuard = req.user.role === "admin" ? "" : "AND owner_user_id = @ownerUserId";
  db.prepare(`
    UPDATE documents
    SET title = COALESCE(@title, title),
        source_name = COALESCE(@sourceName, source_name),
        source_id = COALESCE(@sourceId, source_id),
        type_name = COALESCE(@typeName, type_name),
        type_id = COALESCE(@typeId, type_id),
        category_id = COALESCE(@categoryId, category_id),
        tags_json = COALESCE(@tagsJson, tags_json),
        raw_text = COALESCE(@rawText, raw_text),
        analysis_json = COALESCE(@analysisJson, analysis_json),
        skill_version = COALESCE(@skillVersion, skill_version),
        favorite = COALESCE(@favorite, favorite),
        updated_at = @updatedAt
    WHERE id = @id ${ownerGuard}
  `).run({
    id: req.params.id,
    ownerUserId: req.user.id,
    title: req.body.title ?? null,
    sourceName: req.body.sourceName ?? null,
    sourceId: req.body.sourceId ?? null,
    typeName: req.body.typeName ?? null,
    typeId: req.body.typeId ?? null,
    categoryId: req.body.categoryId ?? null,
    tagsJson: req.body.tags ? json(req.body.tags) : null,
    rawText: req.body.rawText ?? null,
    analysisJson: req.body.analysis ? json(req.body.analysis) : null,
    skillVersion: req.body.skillVersion ?? null,
    favorite: typeof req.body.favorite === "boolean" ? Number(req.body.favorite) : null,
    updatedAt: now(),
  });
  const updated = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  audit(req, "update_document", { targetType: "document", targetId: req.params.id });
  res.json({ document: documentResponse(updated) });
});

app.delete("/api/documents/:id", requireAuth(db), (req, res) => {
  const row = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  if (!row || !canReadDocument(req.user, row)) {
    res.status(404).json({ error: "DOCUMENT_NOT_FOUND" });
    return;
  }
  db.prepare("UPDATE documents SET deleted_at = ?, updated_at = ? WHERE id = ?").run(now(), now(), req.params.id);
  audit(req, "delete_document", { targetType: "document", targetId: req.params.id });
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, ".."), {
  extensions: ["html"],
  index: "index.html",
}));

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: error.code });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

function normalizeArticleUrl(value = "") {
  const url = new URL(String(value).trim());
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("只支持 http 或 https 链接。");
  }
  url.hash = "";
  return url.toString();
}

function kmsHost(configuredHost = "") {
  return String(configuredHost || process.env.KMS_HOST || "kms.fineres.com").trim().toLowerCase();
}

function isKmsUrl(targetUrl, configuredHost = "") {
  const url = new URL(targetUrl);
  return url.hostname.toLowerCase() === kmsHost(configuredHost);
}

function kmsPageIdFromUrl(targetUrl) {
  const url = new URL(targetUrl);
  const pageId = url.searchParams.get("pageId") || url.pathname.match(/\/pages\/(\d+)/)?.[1] || "";
  if (!/^\d+$/.test(pageId)) {
    throw new Error("KMS URL 中没有识别到 pageId。");
  }
  return pageId;
}

async function fetchKmsArticle(targetUrl, options = {}) {
  const host = kmsHost(options.host);
  const token = String(options.token || process.env.KMS_API_TOKEN || "").trim();
  if (!token) {
    throw new Error("缺少 KMS API 个人访问令牌。");
  }
  const pageId = kmsPageIdFromUrl(targetUrl);
  const apiUrl = `https://${host}/rest/api/content/${pageId}?expand=body.storage,body.view,version`;
  const response = await fetch(apiUrl, {
    headers: {
      "accept": "application/json",
      "authorization": `Bearer ${token}`,
      "user-agent": "Wistalk/1.0",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`KMS API 返回 ${response.status}：${text.slice(0, 160)}`);
  }
  const payload = await response.json();
  const html = payload?.body?.storage?.value || payload?.body?.view?.value || "";
  return {
    title: normalizeWhitespace(payload?.title || titleFromUrl(targetUrl)).slice(0, 120) || titleFromUrl(targetUrl),
    rawText: stripHtml(html),
  };
}

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const parts = address.split(".").map(Number);
    return (
      parts[0] === 10
      || parts[0] === 127
      || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
      || (parts[0] === 192 && parts[1] === 168)
      || (parts[0] === 169 && parts[1] === 254)
      || parts[0] === 0
    );
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
  }
  return true;
}

async function assertPublicHttpUrl(targetUrl) {
  const { hostname } = new URL(targetUrl);
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new Error("不允许读取内网、本机或不可解析地址。");
  }
}

async function fetchPublicUrl(targetUrl, redirectsLeft = 5) {
  await assertPublicHttpUrl(targetUrl);
  const response = await fetch(targetUrl, {
    redirect: "manual",
    headers: {
      "user-agent": "Wistalk/1.0 (+https://github.com/simonlvpin/wistalk)",
      "accept": "text/html,text/plain;q=0.9,application/xhtml+xml;q=0.8",
    },
    signal: AbortSignal.timeout(15000),
  });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    if (redirectsLeft <= 0) {
      throw new Error("URL 重定向次数过多。");
    }
    const location = response.headers.get("location");
    if (!location) {
      throw new Error("URL 重定向缺少 Location。");
    }
    const nextUrl = normalizeArticleUrl(new URL(location, targetUrl).toString());
    return fetchPublicUrl(nextUrl, redirectsLeft - 1);
  }
  return response;
}

function normalizeWhitespace(value = "") {
  return String(value)
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripHtml(value = "") {
  return normalizeWhitespace(String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section|\/article|\/tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#039;|&apos;/gi, "'"));
}

function titleFromUrl(targetUrl) {
  const url = new URL(targetUrl);
  const slug = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || url.hostname)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return slug || url.hostname;
}

function extractMeta(html, pattern) {
  const match = html.match(pattern);
  return match ? stripHtml(match[1]) : "";
}

function extractArticleFromHtml(html, targetUrl) {
  const cleanHtml = String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(nav|header|footer|aside|form|button|iframe|svg|canvas)\b[\s\S]*?<\/\1>/gi, " ");
  const title = extractMeta(cleanHtml, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i)
    || extractMeta(cleanHtml, /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["'][^>]*>/i)
    || extractMeta(cleanHtml, /<title[^>]*>([\s\S]*?)<\/title>/i)
    || titleFromUrl(targetUrl);
  const articleMatch = cleanHtml.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = cleanHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = cleanHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const candidates = [articleMatch?.[1], mainMatch?.[1], bodyMatch?.[1], cleanHtml]
    .filter(Boolean)
    .map(stripHtml);
  const rawText = candidates.sort((a, b) => b.length - a.length)[0] || "";
  return {
    title: normalizeWhitespace(title).slice(0, 120) || titleFromUrl(targetUrl),
    rawText,
  };
}

function documentResponse(row) {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    title: row.title,
    materialSourceName: row.source_name,
    materialSourceId: row.source_id,
    materialTypeName: row.type_name,
    materialTypeId: row.type_id,
    categoryId: row.category_id,
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    rawText: row.raw_text,
    analysis: row.analysis_json ? JSON.parse(row.analysis_json) : null,
    skillVersion: row.skill_version,
    favorite: Boolean(row.favorite),
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

ensureAdmin(db)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Wistalk API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
