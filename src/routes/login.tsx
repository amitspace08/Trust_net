import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "TrustNet — Sign In" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      router.navigate({ to: "/" });
    } catch (e: any) {
      setErr(e.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9fc] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="material-symbols-outlined text-[#0d631b]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
          <span className="text-xl font-bold text-[#0d631b] tracking-tight">TrustNet</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your TrustNet account.</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="text-sm text-gray-700 flex flex-col gap-1">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#0d631b]/40" />
          </label>
          <label className="text-sm text-gray-700 flex flex-col gap-1">
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#0d631b]/40" />
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
            className="mt-2 bg-[#0d631b] text-white font-semibold py-2.5 rounded-full hover:bg-[#0a4f15] active:scale-[0.98] transition disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
          New to TrustNet? <Link to="/signup" className="text-[#0d631b] font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
