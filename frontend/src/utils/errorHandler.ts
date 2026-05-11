export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Bilinmeyen bir hata oluştu";
};