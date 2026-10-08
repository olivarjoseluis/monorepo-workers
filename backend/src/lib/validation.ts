export type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; message: string };

/**
 * Validación de email deliberadamente simple y predecible: recorta espacios,
 * normaliza a minúsculas y comprueba una forma `local@dominio.tld`.
 *
 * No intenta ser RFC 5322 — la verificación real de un email es enviarle un
 * correo, no una expresión regular.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const MAX_EMAIL_LENGTH = 254;

export function validateEmail(input: unknown): ValidationResult {
  if (typeof input !== "string") {
    return { valid: false, message: "El campo 'email' es obligatorio." };
  }

  const value = input.trim().toLowerCase();

  if (value.length === 0) {
    return { valid: false, message: "El email no puede estar vacío." };
  }

  if (value.length > MAX_EMAIL_LENGTH) {
    return { valid: false, message: "El email es demasiado largo." };
  }

  if (!EMAIL_PATTERN.test(value)) {
    return { valid: false, message: "El formato del email no es válido." };
  }

  return { valid: true, value };
}
