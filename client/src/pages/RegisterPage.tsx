import { User } from "lucide-react";
import { useTranslation } from "../utils/i18n";
import RegisterForm from "../components/forms/RegisterForm";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-white md:grid-cols-[0.95fr_1fr]">
      <div className="relative order-2 flex items-center justify-center bg-gradient-to-b from-background-surface via-background to-background px-6 py-12 md:order-1">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {t("auth.register.cta")}
            </p>
            <h2 className="text-3xl font-semibold">
              {t("auth.register.heading")}
            </h2>
            <p className="text-sm text-slate-300">{t("auth.register.desc")}</p>
          </div>

          <RegisterForm />
        </div>
      </div>

      <div className="relative order-1 overflow-hidden md:order-2">
        <div className="absolute inset-0 bg-[url('/registerimage.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-surface/95 to-primary-900/80" />
        <div className="absolute left-6 top-8 h-60 w-60 rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="absolute bottom-10 right-4 h-56 w-56 rounded-full bg-cyan-400/25 blur-[120px]" />

        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-6 px-10 py-16 text-white">
          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 backdrop-blur">
            <User size={16} />
            <span>{t("auth.register.tag")}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("auth.register.title")}
          </h1>
          <p className="max-w-lg text-slate-200">
            {t("auth.register.subtitle")}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">Verified</p>
              <p className="text-xs">{t("auth.register.client")}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">Saved sync</p>
              <p className="text-xs">{t("auth.register.sync")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
