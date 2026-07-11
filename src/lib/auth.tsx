import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; name: string; email: string };
type AuthState = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const KEY = "trustnet_auth_user";
const USERS_KEY = "trustnet_auth_users";

const Ctx = createContext<AuthState | null>(null);

function readUsers(): Record<string, { name: string; password: string; id: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeUsers(u: Record<string, { name: string; password: string; id: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.warn("Failed to load user from localStorage", err);
    }
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const value: AuthState = {
    user,
    ready,
    async login(email, password) {
      const users = readUsers();
      const rec = users[email.toLowerCase()];
      if (!rec) throw new Error("No account found for this email");
      if (rec.password !== password) throw new Error("Incorrect password");
      persist({ id: rec.id, name: rec.name, email: email.toLowerCase() });
    },
    async signup(name, email, password) {
      const users = readUsers();
      const key = email.toLowerCase();
      if (users[key]) throw new Error("An account already exists for this email");
      const id = crypto.randomUUID();
      users[key] = { name, password, id };
      writeUsers(users);
      persist({ id, name, email: key });
    },
    logout() {
      persist(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
