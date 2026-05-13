import i18next from "i18next";
import validator from "multiform-validator";

const MIN_PASSWORD_LENGTH = 6;

function normalizeEmail(email: string) {
  return email.trim();
}

export function validateLogin(
  email: string,
  password: string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const normalizedEmail = normalizeEmail(email);

  if (validator.isEmpty(normalizedEmail))
    errors.email = i18next.t("Email is required");
  else if (!validator.isEmail(normalizedEmail))
    errors.email = i18next.t("Enter a valid email address");

  if (validator.isEmpty(password))
    errors.password = i18next.t("Password is required");
  else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = i18next.t(
      "Password must be at least {{count}} characters",
      { count: MIN_PASSWORD_LENGTH },
    );
  }

  return errors;
}

export function validateRegister(
  email: string,
  password: string,
): Record<string, string> {
  return validateLogin(email, password);
}
