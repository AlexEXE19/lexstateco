import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useTranslation } from "../utils/i18n";
import LoginForm from "../components/forms/LoginForm";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-white md:grid-cols-[1fr_0.9fr]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/loginimage.jpg')] bg-cover bg-center" />
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
          <LoginForm />
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
