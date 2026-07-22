import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const localUser = JSON.parse(raw);
          if (firebaseUser && firebaseUser.uid === localUser.id) {
            setUser(localUser);
          } else if (firebaseUser) {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || localUser.name || "User",
              email: firebaseUser.email || localUser.email || "",
            });
          } else {
            // If local storage has user but firebase auth is signed out, sign in anonymously to keep context
            signInAnonymously(auth).catch(console.error);
            setUser(localUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("Failed to load user from localStorage", err);
      }
      setReady(true);
    });
    return () => unsubscribe();
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
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        persist({ id: firebaseUser.uid, name: firebaseUser.displayName || email.split("@")[0], email: email.toLowerCase() });
      } catch (firebaseErr: any) {
        console.warn("Firebase email login failed, falling back to mock database:", firebaseErr);
        const users = readUsers();
        const rec = users[email.toLowerCase()];
        if (!rec) throw new Error("No account found for this email");
        if (rec.password !== password) throw new Error("Incorrect password");
        
        await signInAnonymously(auth);
        const currentUser = auth.currentUser;
        const finalUid = currentUser ? currentUser.uid : rec.id;
        
        rec.id = finalUid;
        users[email.toLowerCase()] = rec;
        writeUsers(users);

        persist({ id: finalUid, name: rec.name, email: email.toLowerCase() });
      }
    },
    async signup(name, email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        persist({ id: firebaseUser.uid, name, email: email.toLowerCase() });
      } catch (firebaseErr: any) {
        console.warn("Firebase email signup failed, falling back to mock database:", firebaseErr);
        const users = readUsers();
        const key = email.toLowerCase();
        if (users[key]) throw new Error("An account already exists for this email");
        
        await signInAnonymously(auth);
        const currentUser = auth.currentUser;
        const finalUid = currentUser ? currentUser.uid : crypto.randomUUID();
        
        users[key] = { name, password, id: finalUid };
        writeUsers(users);
        persist({ id: finalUid, name, email: key });
      }
    },
    logout() {
      signOut(auth).catch(console.error);
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
