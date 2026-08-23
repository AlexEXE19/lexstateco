import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../utils/i18n";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { t } = useTranslation();

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = await login({ email, password });

    if (errorMessage) {
      alert(errorMessage);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-white md:grid-cols-[1fr_0.9fr]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/loginimage.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-surface/95 to-primary-900/80" />
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="absolute right-0 bottom-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-[120px]" />

        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-6 px-10 py-16">
          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 backdrop-blur">
            <Lock size={16} />
            <span>{t("auth.login.tag")}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("auth.login.title")}
          </h1>
          <p className="max-w-lg text-slate-200">{t("auth.login.subtitle")}</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">4.9 / 5</p>
              <p className="text-xs">{t("auth.login.client")}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">24/7</p>
              <p className="text-xs">{t("auth.login.sessions")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gradient-to-b from-background-surface via-background to-background px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {t("auth.login.cta")}
            </p>
            <h2 className="text-3xl font-semibold">
              {t("auth.login.heading")}
            </h2>
            <p className="text-sm text-slate-300">{t("auth.login.desc")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("auth.login.email")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Mail size={16} className="text-primary-200" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              {t("auth.login.password")}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
                <Lock size={16} className="text-primary-200" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button
              className="w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400"
              type="submit"
            >
              {t("auth.login.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              {t("auth.login.create")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
