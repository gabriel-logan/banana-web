import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiKey,
  FiMail,
  FiMonitor,
  FiSmartphone,
  FiUserPlus,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRegister } from "../hooks/useAuth";
import { parseApiError } from "../utils/handleApiError";
import { validateRegister } from "../validators/auth.validator";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    setSubmitError(null);
    const nextErrors = validateRegister(value, password);
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
    const nextErrors = validateRegister(email, value);
    setErrors((current) => {
      const updated = { ...current };

      if (nextErrors.password) updated.password = nextErrors.password;
      else delete updated.password;

      return updated;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRegister(email, password);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await registerMutation.mutateAsync({ email: email.trim(), password });
      toast.success(t("Account created successfully."));
      navigate("/reservations");
    } catch (error) {
      const parsedError = parseApiError(error);
      setSubmitError(parsedError.message);
      setErrors((current) => ({ ...current, ...parsedError.fieldErrors }));
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-6xl items-start gap-8 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
      <section className="order-1 rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:rounded-[32px] sm:p-8 lg:order-1 lg:shadow-[0_30px_80px_rgba(15,23,42,0.14)]">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--banana-leaf)] uppercase">
            {t("Create account")}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            {t("Start booking rooms")}
          </h1>
          <p className="text-sm text-slate-500">
            {t(
              "Register with your work email to manage meeting spaces across the company.",
            )}
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {submitError && (
            <Alert title={t("Unable to create account")}>{submitError}</Alert>
          )}
          <Input
            autoComplete="email"
            error={errors.email}
            hint={t("Prefer your work email for easier team identification.")}
            label={t("Email")}
            name="email"
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder={t("you@company.com")}
            type="email"
            value={email}
          />
          <Input
            autoComplete="new-password"
            error={errors.password}
            hint={t("Use at least 6 characters.")}
            label={t("Password")}
            name="password"
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder={t("Create a password")}
            type="password"
            value={password}
          />
          <Button
            className="w-full"
            disabled={registerMutation.isPending}
            type="submit"
            variant="secondary"
          >
            {registerMutation.isPending ? <FiKey /> : <FiUserPlus />}
            {registerMutation.isPending
              ? t("Creating...")
              : t("Create account")}
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          {t("Already have an account?")}{" "}
          <Link className="font-semibold text-[var(--banana-leaf)]" to="/login">
            {t("Sign in")}
          </Link>
        </p>
      </section>

      <section className="order-2 space-y-5 lg:order-2">
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-[var(--banana-leaf)] uppercase">
          {t("Lightweight microservice architecture")}
        </div>
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {t("One sign-in, one JWT, all reservation actions unlocked.")}
        </h2>
        <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          {t(
            "The auth service handles identity, while the reservations service stays focused on rooms, branches, and conflict validation.",
          )}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[26px] border border-white/60 bg-white/75 p-5 shadow-[0_22px_60px_rgba(148,163,184,0.14)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-slate-900">
              <FiMonitor />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {t("In-memory session")}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(
                "Auth state stays simple and local to the current app session.",
              )}
            </p>
          </div>
          <div className="rounded-[26px] border border-white/60 bg-white/75 p-5 shadow-[0_22px_60px_rgba(148,163,184,0.14)]">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-[var(--banana-leaf)]">
              <FiSmartphone />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {t("Responsive booking flow")}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t("Manage reservations comfortably on desktop or mobile.")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2">
            <FiMail />
            {t("Email-based sign-up")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2">
            <FiKey />
            {t("Shared JWT secret flow")}
          </span>
        </div>
      </section>
    </div>
  );
}
