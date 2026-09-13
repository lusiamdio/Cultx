import type { NextFunction, Request, Response } from "express";

export type AuthenticatedUser = { id: string; email?: string; roles: string[] };

declare global { namespace Express { interface Request { auth?: AuthenticatedUser } } }

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://anityrvwhyocvnvyxmqp.supabase.co";
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_nq1jUVA5KxdDIQVp3sT3Fg_eI5x0EZM";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Authentication is required.", requestId: res.locals.requestId } });
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Invalid session");
    const user = await response.json() as { id: string; email?: string; app_metadata?: { role?: string }; user_metadata?: { role?: string } };
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`, { headers: { apikey: publishableKey, Authorization: `Bearer ${token}` } });
    const profiles = profileResponse.ok ? await profileResponse.json() as Array<{ role?: string }> : [];
    req.auth = { id: user.id, email: user.email, roles: [profiles[0]?.role || user.app_metadata?.role || user.user_metadata?.role || "farmer"] };
    return next();
  } catch { return res.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Your Supabase session is invalid or expired.", requestId: res.locals.requestId } }); }
}

export const requireOrganizationAccess = (_organizationId: string) => requireAuth;
export const requireFarmAccess = (_farmId: string) => requireAuth;
export const requireRole = (...roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth) {
    await requireAuth(req, res, () => undefined);
    if (!req.auth) return;
  }
  return req.auth.roles.some((role) => roles.includes(role))
    ? next()
    : res.status(403).json({ error: { code: "ROLE_FORBIDDEN", message: "Your role is not permitted to perform this action.", requestId: res.locals.requestId } });
};
