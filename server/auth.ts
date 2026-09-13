import type { NextFunction, Request, Response } from "express";

export type AuthenticatedUser = { id: string; email?: string; roles: string[] };

declare global { namespace Express { interface Request { auth?: AuthenticatedUser } } }

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://anityrvwhyocvnvyxmqp.supabase.co";
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_nq1jUVA5KxdDIQVp3sT3Fg_eI5x0EZM";

