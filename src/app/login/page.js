"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/authApi";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Başarılı giriş sonrası dashboard'a yönlendir
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Giriş yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-4xl font-[Parkinsans] font-semibold  text-gray-900">
            Admin Paneli
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 font-[Parkinsans] tracking-wide px-4 py-4 rounded-md">
              {error}
            </div>
          )}
          <div className=" space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block rounded-md placeholder:text-gray-400 placeholder:tracking-wide font-[Parkinsans] w-full px-3 py-4 border border-gray-300  text-gray-900 focus:outline-none focus:ring-black f  ocus:border-black focus:z-10 "
                placeholder="Email adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block  placeholder:text-gray-400 placeholder:tracking-wide font-[Parkinsans] w-full px-3 py-4 border border-gray-300  text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 "
                placeholder="Şifre"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4  text-white bg-black font-[Parkinsans] font-semibold rounded-md tracking-wider"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
