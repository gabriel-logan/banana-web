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

  if (validator.isEmpty(normalizedEmail)) errors.email = "Email is required";
  else if (!validator.isEmail(normalizedEmail))
    errors.email = "Enter a valid email address";

  if (validator.isEmpty(password)) errors.password = "Password is required";
  else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return errors;
}

export function validateRegister(
  email: string,
  password: string,
): Record<string, string> {
  return validateLogin(email, password);
}
