import { Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../utils/i18n";
import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterFormFields, registerSchema } from "../../schemas/FormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { register: registerUser, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({ resolver: zodResolver(registerSchema) });

  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && <p className="error mb-4 text-red-400">{authError}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("auth.register.firstName")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <User size={16} className="text-primary-200" />
            <input
              {...register("firstName")}
              type="text"
              placeholder="Jane"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-red-400">{errors.firstName.message}</p>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t("auth.register.lastName")}
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
            <User size={16} className="text-primary-200" />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Doe"
              className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-red-400">{errors.lastName.message}</p>
          )}
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t("auth.register.email")}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
          <Mail size={16} className="text-primary-200" />
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t("auth.register.password")}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
          <Lock size={16} className="text-primary-200" />
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t("auth.register.phone")}
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
          <Phone size={16} className="text-primary-200" />
          <input
            {...register("phone")}
            type="text"
            placeholder="(555) 123-9876"
            className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-400">{errors.phone.message}</p>
        )}
      </label>

      <button
        className="w-full rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:-translate-y-[1px] hover:bg-primary-400 disabled:opacity-50"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : t("auth.register.submit")}
      </button>
    </form>
  );
};

export default RegisterForm;
