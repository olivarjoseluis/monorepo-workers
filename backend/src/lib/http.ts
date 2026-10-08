/**
 * Forma única de las respuestas JSON de la API, para que el frontend pueda
 * discriminar por el campo `success` sin adivinar.
 */
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function fail(code: string, message: string): ApiError {
  return { success: false, error: { code, message } };
}
