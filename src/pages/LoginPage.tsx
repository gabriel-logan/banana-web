import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiLock, FiMail, FiShield, FiZap } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useLogin } from "../hooks/useAuth";
import { parseApiError } from "../utils/handleApiError";
import { validateLogin } from "../validators/auth.validator";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    setSubmitError(null);
    const nextErrors = validateLogin(value, password);
    setErrors((current) => {
      const updated = { ...current };

      if (nextErrors.email) updated.email = nextErrors.email;
      else delete updated.email;

      return updated;
    });
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setSubmitError(null);
    const nextErrors = validateLogin(email, value);
    setErrors((current) => {
      const updated = { ...current };

      if (nextErrors.password) updated.password = nextErrors.password;
      else delete updated.password;

      return updated;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      toast.success(t("Welcome back."));
      navigate("/reservations");
    } catch (error) {
      const parsedError = parseApiError(error);
      setSubmitError(parsedError.message);
      setErrors((current) => ({ ...current, ...parsedError.fieldErrors }));
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-[var(--banana-leaf)] uppercase">
          {t("Shared workspace booking")}
        </div>
        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {t("Reserve the right room before the meeting starts.")}
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {t(
              "Sign in to manage reservations across branches, keep schedules tidy, and avoid overlapping bookings.",
            )}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[26px] border border-white/60 bg-white/75 p-5 shadow-[0_22px_60px_rgba(148,163,184,0.14)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <FiShield />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {t("Protected reservation flow")}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(
                "Access is guarded by the auth service and every reservation call uses the issued JWT.",
              )}
            </p>
          </div>
          <div className="rounded-[26px] border border-white/60 bg-white/75 p-5 shadow-[0_22px_60px_rgba(148,163,184,0.14)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-slate-900">
              <FiZap />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {t("Conflict-aware scheduling")}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(
                "The reservations API blocks overlapping bookings in the same room and branch.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--banana-leaf)] uppercase">
            {t("Sign in")}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {t("Welcome back")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("Use your account to continue to the reservations dashboard.")}
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {submitError && (
            <Alert title={t("Unable to sign in")}>{submitError}</Alert>
          )}
          <Input
            autoComplete="email"
            error={errors.email}
            hint={t("Use the same email registered in the auth service.")}
            label={t("Email")}
            name="email"
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder={t("you@company.com")}
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            error={errors.password}
            hint={t(
              "Your access token will be issued after a successful sign-in.",
            )}
            label={t("Password")}
            name="password"
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder={t("Your password")}
            type="password"
            value={password}
          />
          <Button
            className="w-full"
            disabled={loginMutation.isPending}
            type="submit"
            variant="secondary"
          >
            {loginMutation.isPending ? <FiCalendar /> : <FiLock />}
            {loginMutation.isPending ? t("Signing in...") : t("Sign in")}
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          {t("New here?")}{" "}
          <Link
            className="font-semibold text-[var(--banana-leaf)]"
            to="/register"
          >
            {t("Create an account")}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
            <FiMail />
            {t("Auth via email")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
            <FiCalendar />
            {t("Reservation-ready access")}
          </span>
        </div>
      </section>
    </div>
  );
}
