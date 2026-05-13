export const devLog = {
  info(message: string, details?: unknown) {
    if (__DEV__) {
      console.info(message, details);
    }
  },
  warn(message: string, details?: unknown) {
    if (__DEV__) {
      console.warn(message, details);
    }
  }
};
