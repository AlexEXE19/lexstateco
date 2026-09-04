import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../hooks/useAuth";
import { LoginFormFields, loginSchema } from "../../schemas/FormSchemas";
import { useTranslation } from "../../utils/i18n";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();

  const { login, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {authError && (
        <p className="border-l-2 border-rose-500 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {authError}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="login-email">
          {t("auth.login.email")}
        </label>
        <input
          id="login-email"
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="field"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="field-label" htmlFor="login-password">
          {t("auth.login.password")}
        </label>
        <input
          id="login-password"
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="field"
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-rose-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : t("auth.login.submit")}
      </button>
    </form>
  );
};

export default LoginForm;
