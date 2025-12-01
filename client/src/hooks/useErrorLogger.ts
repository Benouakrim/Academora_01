// Simple placeholder error logger. Replace with Sentry/Datadog/etc.
export function logError(error: unknown, info?: unknown) {
  // eslint-disable-next-line no-console
  console.error('[AppError]', error, info)
}

export function useErrorLogger() {
  return logError
}