import validator from "multiform-validator"

export function validateLogin(email: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {}

  if (validator.isEmpty(email)) errors.email = "Email is required"
  else if (!validator.isEmail(email)) errors.email = "Invalid email"

  if (validator.isEmpty(password)) errors.password = "Password is required"

  return errors
}

export function validateRegister(email: string, password: string): Record<string, string> {
  return validateLogin(email, password)
}
