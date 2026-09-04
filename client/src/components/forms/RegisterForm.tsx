import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../hooks/useAuth";
import { RegisterFormFields, registerSchema } from "../../schemas/FormSchemas";
import { useTranslation } from "../../utils/i18n";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {authError && (
        <p className="border-l-2 border-rose-500 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {authError}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="register-first">
            {t("auth.register.firstName")}
          </label>
          <input
            id="register-first"
            {...register("firstName")}
            type="text"
            placeholder="Jane"
            className="field"
          />
          {errors.firstName && (
            <p className="mt-1.5 text-xs text-rose-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="field-label" htmlFor="register-last">
            {t("auth.register.lastName")}
          </label>
          <input
            id="register-last"
            {...register("lastName")}
            type="text"
            placeholder="Doe"
            className="field"
          />
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-rose-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="register-email">
          {t("auth.register.email")}
        </label>
        <input
          id="register-email"
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
        <label className="field-label" htmlFor="register-password">
          {t("auth.register.password")}
        </label>
        <input
          id="register-password"
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

      <div>
        <label className="field-label" htmlFor="register-phone">
          {t("auth.register.phone")}
        </label>
        <input
          id="register-phone"
          {...register("phone")}
          type="text"
          placeholder="(555) 123-9876"
          className="field"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.phone.message}</p>
        )}
      </div>

      <button
        className="btn-primary w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : t("auth.register.submit")}
      </button>
    </form>
  );
};

export default RegisterForm;
