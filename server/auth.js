const jwt = require("jsonwebtoken");
const { publicUser, requireSecret } = require("./security");

const TOKEN_TTL = "12h";

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    requireSecret(),
    { expiresIn: TOKEN_TTL },
  );
}

function requireAuth(db) {
  return (req, res, next) => {
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      res.status(401).json({ error: "UNAUTHENTICATED" });
      return;
    }
    try {
      const payload = jwt.verify(token, requireSecret());
      const user = db.prepare("SELECT * FROM users WHERE id = ? AND status = 'active'").get(payload.sub);
      if (!user) {
        res.status(401).json({ error: "UNAUTHENTICATED" });
        return;
      }
      req.user = user;
      req.publicUser = publicUser(user);
      next();
    } catch (error) {
      res.status(401).json({ error: "UNAUTHENTICATED" });
    }
  };
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "FORBIDDEN" });
    return;
  }
  next();
}

module.exports = {
  requireAdmin,
  requireAuth,
  signToken,
};
