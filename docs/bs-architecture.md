# Wistalk B/S 架构改造说明

当前仓库已加入轻量 B/S 后端骨架。目标是把原来保存在每台电脑浏览器 IndexedDB 中的数据，迁移到服务端集中数据库，让不同用户可以在不同电脑上使用同一套账号体系登录和访问自己的数据。

## 技术选型

- 后端：Node.js + Express
- 数据库：Node 内置 `node:sqlite` + SQLite，文件位置由 `DATABASE_PATH` 控制
- 认证：JWT Bearer Token
- 密码：Node `crypto.scrypt` 哈希，不保存明文密码
- 敏感配置：大模型 API Key 等通过 AES-256-GCM 加密后入库
- 文件上传：`multer` 内存接收，原始文件以 BLOB 写入数据库

## 已覆盖的数据对象

- 用户账号、角色、状态、密码 hash
- 用户系统配色、字体大小、资料来源、资料类型
- 用户大模型配置，包含 API Key 加密存储
- 材料文档、原文、分析 JSON、标签、收藏、软删除
- 上传文件原始二进制、文件名、MIME、大小、SHA-256
- 生成文章表、资料分类表、审计日志表

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 创建配置：

```bash
cp .env.example .env
```

3. 修改 `.env` 中的 `APP_SECRET` 和 `ADMIN_INITIAL_PASSWORD`。

4. 启动：

```bash
npm run dev
```

5. 打开：

```text
http://localhost:8787
```

首次启动会在数据库中初始化 `ADMIN_EMAIL` 对应的管理员。

## 关键 API

- `POST /api/auth/login`：登录，返回 token
- `GET /api/auth/me`：读取当前用户
- `POST /api/auth/change-password`：修改密码
- `GET /api/admin/users`：管理员查看用户
- `POST /api/admin/users`：管理员创建用户
- `POST /api/admin/users/:id/reset-password`：管理员重置密码
- `GET /api/settings`：读取用户配置
- `PUT /api/settings`：保存配色、字体、资料类型、大模型配置
- `GET /api/documents`：读取材料列表
- `POST /api/documents/upload`：上传材料文件并写入数据库
- `PUT /api/documents/:id`：更新材料、分析结果、收藏状态
- `DELETE /api/documents/:id`：软删除材料

## 安全注意事项

- 生产环境必须使用 HTTPS，否则登录 token 和上传内容会暴露在网络中。
- `APP_SECRET` 必须足够长，且不要提交到 GitHub。
- SQLite 数据库文件要放在服务端私有目录，不能被 Web 静态目录直接访问。
- 定期备份 `data/wistalk.sqlite`，并同时保护备份文件。
- 管理员创建或重置出来的初始密码只展示一次，用户首次登录后应修改。
- API Key 已加密入库，但如果服务器密钥泄露，仍有解密风险，所以服务器访问权限要最小化。
- 后续上线建议加反向代理限流，例如 Nginx 对 `/api/auth/login` 做登录频率限制。

## 下一步迁移

后端基础已经准备好，但当前前端主逻辑仍主要读写 IndexedDB。下一步需要做一个前端 API 适配层，把 `getUser`、`saveUser`、`loadDocuments`、`saveDocument`、`loadGeneratedArticles`、`saveUploadState` 等函数逐步替换成 `/api/...` 调用。
