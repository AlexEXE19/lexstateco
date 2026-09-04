import { Link } from "react-router-dom";

import LoginForm from "../components/forms/LoginForm";
import { useTranslation } from "../utils/i18n";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/loginimage.jpg"
          alt="A bright apartment interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute bottom-0 left-0 p-12">
          <p className="max-w-sm font-display text-2xl leading-snug text-white">
            {t("auth.login.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{t("auth.login.cta")}</p>
          <h1 className="mt-3 font-display text-display-sm text-ink">
            {t("auth.login.heading")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {t("auth.login.desc")}
          </p>

          <div className="mt-9">
            <LoginForm />
          </div>

          <p className="mt-8 border-t border-line pt-6 text-sm text-ink-muted">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/register"
              className="border-b border-ink pb-0.5 font-medium text-ink"
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
