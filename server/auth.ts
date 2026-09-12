import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { mkdirSync } from "node:fs";
import type { NextFunction, Request, Response } from "express";

export type AppRole = "farmer" | "cooperative_admin" | "buyer" | "government_officer" | "platform_admin";


declare global { namespace Express { interface Request { auth?: AuthenticatedUser } } }

const dbPath = process.env.IDENTITY_DB_PATH || path.join(process.cwd(), "data", "cultx-identity.sqlite");
mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath, { enableForeignKeyConstraints: true });
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, country_code TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, country_code TEXT NOT NULL, mfa_secret TEXT, mfa_enabled INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS roles (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
  CREATE TABLE IF NOT EXISTS permissions (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
  CREATE TABLE IF NOT EXISTS role_permissions (role_id TEXT NOT NULL REFERENCES roles(id), permission_id TEXT NOT NULL REFERENCES permissions(id), PRIMARY KEY(role_id, permission_id));
  CREATE TABLE IF NOT EXISTS memberships (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), organization_id TEXT NOT NULL REFERENCES organizations(id), role_id TEXT NOT NULL REFERENCES roles(id), delegated_consent INTEGER NOT NULL DEFAULT 0, UNIQUE(user_id, organization_id, role_id));
  CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, revoked_at TEXT, created_at TEXT NOT NULL);

  CREATE TABLE IF NOT EXISTS password_resets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, used_at TEXT);
  CREATE TABLE IF NOT EXISTS farms (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), owner_user_id TEXT NOT NULL REFERENCES users(id), country_code TEXT NOT NULL, shared_with_json TEXT NOT NULL DEFAULT '[]');
  CREATE TABLE IF NOT EXISTS contracts (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), owner_user_id TEXT NOT NULL REFERENCES users(id), country_code TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), farm_id TEXT REFERENCES farms(id), owner_user_id TEXT NOT NULL REFERENCES users(id), country_code TEXT NOT NULL, visibility TEXT NOT NULL DEFAULT 'private');
  CREATE TABLE IF NOT EXISTS listings (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), owner_user_id TEXT NOT NULL REFERENCES users(id), country_code TEXT NOT NULL, visibility TEXT NOT NULL DEFAULT 'organization');
  CREATE TABLE IF NOT EXISTS telemetry (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES organizations(id), farm_id TEXT NOT NULL REFERENCES farms(id), country_code TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY, occurred_at TEXT NOT NULL, actor_user_id TEXT, action TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT, metadata_json TEXT NOT NULL);
  CREATE TRIGGER IF NOT EXISTS audit_logs_no_update BEFORE UPDATE ON audit_logs BEGIN SELECT RAISE(ABORT, 'audit logs are immutable'); END;
  CREATE TRIGGER IF NOT EXISTS audit_logs_no_delete BEFORE DELETE ON audit_logs BEGIN SELECT RAISE(ABORT, 'audit logs are immutable'); END;
`);


const roles: Record<AppRole, string[]> = {
  farmer: ["farm:read:own", "farm:write:own", "document:read:own", "ai:use"],
  cooperative_admin: ["farm:read:delegated", "member:read:delegated", "ai:use"],
  buyer: ["listing:read", "contract:read:shared", "ai:use"],
  government_officer: ["policy:simulate", "telemetry:read:aggregated"],
  platform_admin: ["admin:read", "audit:read"],
};
for (const [role, permissions] of Object.entries(roles)) {
  db.prepare("INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)").run(role, role);
  for (const permission of permissions) {
    db.prepare("INSERT OR IGNORE INTO permissions (id, name) VALUES (?, ?)").run(permission, permission);
    db.prepare("INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)").run(role, permission);
  }
}

const id = (prefix: string) => `${prefix}_${randomBytes(16).toString("hex")}`;
const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");
const passwordHash = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};
const passwordMatches = (password: string, encoded: string) => {
  const [salt, hash] = encoded.split(":");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
};
const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const base32Encode = (value: Buffer) => {
  let bits = ""; for (const byte of value) bits += byte.toString(2).padStart(8, "0");
  return (bits.match(/.{1,5}/g) || []).map((chunk) => base32Alphabet[parseInt(chunk.padEnd(5, "0"), 2)]).join("");
};
const base32Decode = (value: string) => {
  const indexes = value.replace(/=|\s/g, "").toUpperCase().split("").map((letter) => base32Alphabet.indexOf(letter));
  if (indexes.some((index) => index < 0)) throw new Error("Invalid MFA secret.");
  const bits = indexes.map((index) => index.toString(2).padStart(5, "0")).join("");
  return Buffer.from((bits.match(/.{8}/g) || []).map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join(""));
};
// RFC 6238 compatible TOTP (SHA-1, six digits, 30-second period), suitable for authenticator apps.
const oneTimeCode = (secret: string, slice = Math.floor(Date.now() / 30_000)) => { const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(slice)); const digest = createHmac("sha1", base32Decode(secret)).update(counter).digest(); const offset = digest[digest.length - 1] & 15; return (((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000)).toString().padStart(6, "0"); };

export const audit = (actorUserId: string | null, action: string, resourceType: string, resourceId: string | null, metadata: Record<string, unknown> = {}) => {
  db.prepare("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?, ?, ?)").run(id("audit"), new Date().toISOString(), actorUserId, action, resourceType, resourceId, JSON.stringify(metadata));
};


  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
  if (existing) throw new Error("An account with that email already exists.");
  const userId = id("usr"), organizationId = id("org");
  db.exec("BEGIN");
  try {
    db.prepare("INSERT INTO users (id, email, password_hash, country_code, created_at) VALUES (?, ?, ?, ?, ?)").run(userId, normalizedEmail, passwordHash(password), countryCode, new Date().toISOString());
    db.prepare("INSERT INTO organizations VALUES (?, ?, ?, ?)").run(organizationId, organizationName.trim(), countryCode, new Date().toISOString());

    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); throw error; }
  audit(userId, "identity.register", "user", userId, { organizationId });
  return userId;
}


}

export function signIn(email: string, password: string, mfaCode?: string) {
  const user = db.prepare("SELECT id, password_hash, mfa_secret, mfa_enabled FROM users WHERE email = ?").get(email.trim().toLowerCase()) as { id: string; password_hash: string; mfa_secret: string | null; mfa_enabled: number } | undefined;
  if (!user || !passwordMatches(password, user.password_hash)) throw new Error("Invalid email or password.");
  if (user.mfa_enabled && (!mfaCode || !user.mfa_secret || ![oneTimeCode(user.mfa_secret), oneTimeCode(user.mfa_secret, Math.floor(Date.now() / 30_000) - 1)].includes(mfaCode))) throw new Error("A valid MFA code is required.");
  const token = randomBytes(32).toString("base64url"), sessionId = id("ses"), expiresAt = new Date(Date.now() + Number(process.env.SESSION_TTL_HOURS || 8) * 3_600_000).toISOString();

}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.headers.cookie?.match(/(?:^|;\s*)cultx_session=([^;]+)/)?.[1];
  const bearer = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearer || cookieToken;
  if (!token) return res.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Authentication is required.", requestId: res.locals.requestId } });

}
export const requireRole = (...allowed: AppRole[]) => (req: Request, res: Response, next: NextFunction) => !req.auth ? requireAuth(req, res, next) : req.auth.roles.some((role) => allowed.includes(role)) ? next() : res.status(403).json({ error: { code: "ROLE_FORBIDDEN", message: "Your role is not permitted to perform this action.", requestId: res.locals.requestId } });
export const requireOrganizationAccess = (organizationId: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth) return requireAuth(req, res, next);
  const organization = db.prepare("SELECT country_code FROM organizations WHERE id = ?").get(organizationId) as { country_code: string } | undefined;
  return req.auth.organizationId === organizationId && organization?.country_code === req.auth.countryCode ? next() : res.status(403).json({ error: { code: "ORGANIZATION_FORBIDDEN", message: "Organization access is denied.", requestId: res.locals.requestId } });
};
export const requireFarmAccess = (farmId: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth) return requireAuth(req, res, next);
  const farm = db.prepare("SELECT organization_id, owner_user_id, country_code, shared_with_json FROM farms WHERE id = ?").get(farmId) as { organization_id: string; owner_user_id: string; country_code: string; shared_with_json: string } | undefined;
  const shared = farm && JSON.parse(farm.shared_with_json) as string[];
  const delegated = req.auth.roles.includes("cooperative_admin") && !!db.prepare("SELECT 1 FROM memberships WHERE user_id = ? AND organization_id = ? AND delegated_consent = 1").get(req.auth.id, farm?.organization_id);
  if (!farm || farm.country_code !== req.auth.countryCode || !(farm.owner_user_id === req.auth.id || shared.includes(req.auth.id) || delegated)) return res.status(403).json({ error: { code: "FARM_FORBIDDEN", message: "Farm access is denied.", requestId: res.locals.requestId } });
  next();
};

export function startPasswordReset(email: string) { const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email.trim().toLowerCase()) as { id: string } | undefined; if (!user) return null; const token = randomBytes(32).toString("base64url"); db.prepare("INSERT INTO password_resets VALUES (?, ?, ?, ?, NULL)").run(id("reset"), user.id, hashToken(token), new Date(Date.now() + 15 * 60_000).toISOString()); audit(user.id, "identity.password_reset_requested", "user", user.id); return token; }
export function completePasswordReset(token: string, password: string) { if (password.length < 12) throw new Error("Password must be at least 12 characters."); const reset = db.prepare("SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?").get(hashToken(token), new Date().toISOString()) as { id: string; user_id: string } | undefined; if (!reset) throw new Error("Password reset token is invalid or expired."); db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash(password), reset.user_id); db.prepare("UPDATE password_resets SET used_at = ? WHERE id = ?").run(new Date().toISOString(), reset.id); db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").run(new Date().toISOString(), reset.user_id); audit(reset.user_id, "identity.password_reset_completed", "user", reset.user_id); }
export function setupMfa(userId: string) { const secret = base32Encode(randomBytes(20)); db.prepare("UPDATE users SET mfa_secret = ? WHERE id = ?").run(secret, userId); return { secret, otpauthUrl: `otpauth://totp/CULTx:${encodeURIComponent(userId)}?secret=${secret}&issuer=CULTx&algorithm=SHA1&digits=6&period=30` }; }
export function confirmMfa(userId: string, code: string) { const row = db.prepare("SELECT mfa_secret FROM users WHERE id = ?").get(userId) as { mfa_secret: string | null }; if (!row?.mfa_secret || code !== oneTimeCode(row.mfa_secret)) throw new Error("Invalid MFA code."); db.prepare("UPDATE users SET mfa_enabled = 1 WHERE id = ?").run(userId); audit(userId, "identity.mfa_enabled", "user", userId); }

