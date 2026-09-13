const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
}

const authStorageKey = "cultx.supabase.session";

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

export type SupabaseSession = { access_token: string; refresh_token: string; user: SupabaseUser };

type AuthResponse = { access_token?: string; refresh_token?: string; user?: SupabaseUser; error?: { message?: string } };

const readSession = (): SupabaseSession | null => {
  try { return JSON.parse(window.localStorage.getItem(authStorageKey) || "null"); } catch { return null; }
};

const storeSession = (session: SupabaseSession | null) => {
  if (session) window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  else window.localStorage.removeItem(authStorageKey);
};

const authRequest = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`${supabaseUrl}/auth/v1${path}`, {
    ...init,
    headers: { apikey: supabaseKey, "Content-Type": "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.msg || data?.message || "Supabase authentication request failed.");
  return data as AuthResponse;
};

export const supabase = {
  getSession: readSession,
  getAccessToken: () => readSession()?.access_token || null,
  async getUser() {
    const session = readSession();
    if (!session) return null;
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: supabaseKey, Authorization: `Bearer ${session.access_token}` } });
      if (!response.ok) { storeSession(null); return null; }
      return await response.json() as SupabaseUser;
    } catch { return null; }
  },
  async signInWithPassword(email: string, password: string) {
    const data = await authRequest("/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
    if (!data.access_token || !data.refresh_token || !data.user) throw new Error("No active session was returned.");
    const session = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user };
    storeSession(session);
    return session;
  },
  async signUp(email: string, password: string) {
    const data = await authRequest("/signup", { method: "POST", body: JSON.stringify({ email, password }) });
    if (data.access_token && data.refresh_token && data.user) storeSession({ access_token: data.access_token, refresh_token: data.refresh_token, user: data.user });
    return data.user || null;
  },
  async signOut() {
    const token = readSession()?.access_token;
    if (token) await authRequest("/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined);
    storeSession(null);
  },
  async getProfile(userId: string) {
    const token = readSession()?.access_token;
    if (!token) return null;
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=role`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ role: string }>;
    return rows[0] || null;
  },
  async getWorkspace() {
    const token = readSession()?.access_token;
    if (!token) return null;
    const response = await fetch(`${supabaseUrl}/rest/v1/workspaces?select=data&limit=1`, { headers: { apikey: supabaseKey, Authorization: `Bearer ${token}` } });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ data: Record<string, unknown> }>;
    return rows[0]?.data || null;
  },
  async saveWorkspace(data: Record<string, unknown>) {
    const token = readSession()?.access_token;
    if (!token) return;
    const response = await fetch(`${supabaseUrl}/rest/v1/workspaces?on_conflict=user_id`, {
      method: "POST",
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: readSession()!.user.id, data, updated_at: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error("Could not save your workspace.");
  },
  subscribeToNotifications(userId: string, onInsert: (record: unknown) => void) {
    const token = readSession()?.access_token;
    if (!token) return () => undefined;
    const websocketUrl = supabaseUrl.replace(/^http/, "ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(supabaseKey) + "&vsn=1.0.0";
    const socket = new WebSocket(websocketUrl);
    let heartbeat: number | undefined;
    socket.onopen = () => {
      socket.send(JSON.stringify({ topic: "realtime:public:notifications", event: "phx_join", payload: { config: { postgres_changes: [{ event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }] }, access_token: token }, ref: "1" }));
      heartbeat = window.setInterval(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(Date.now()) })), 25_000);
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "postgres_changes" && message.payload?.data?.record) onInsert(message.payload.data.record);
    };
    return () => { if (heartbeat) window.clearInterval(heartbeat); socket.close(); };
  },
};
