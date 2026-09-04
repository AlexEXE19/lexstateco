import { Lock, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../utils/i18n";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFormFields, loginSchema } from "../../schemas/FormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && <p className="error">{authError}</p>}
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t("auth.login.email")}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
          <Mail size={16} className="text-primary-200" />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
          />
          {errors.email && <p>{errors.email.message}</p>}
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
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
      </label>

      <button
        className="w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : t("auth.login.submit")}
      </button>
    </form>
  );
};

export default LoginForm;
