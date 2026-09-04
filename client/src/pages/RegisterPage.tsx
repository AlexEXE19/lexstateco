import { Link } from "react-router-dom";

import RegisterForm from "../components/forms/RegisterForm";
import { useTranslation } from "../utils/i18n";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{t("auth.register.cta")}</p>
          <h1 className="mt-3 font-display text-display-sm text-ink">
            {t("auth.register.heading")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {t("auth.register.desc")}
          </p>

          <div className="mt-9">
            <RegisterForm />
          </div>

          <p className="mt-8 border-t border-line pt-6 text-sm text-ink-muted">
            {t("auth.login.cta")}{" "}
            <Link
              to="/login"
              className="border-b border-ink pb-0.5 font-medium text-ink"
            >
              {t("navbar.login")}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src="/registerimage.jpg"
          alt="A house exterior at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute bottom-0 left-0 p-12">
          <p className="max-w-sm font-display text-2xl leading-snug text-white">
            {t("auth.register.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
