export const reportError = (error: Error, LazySentry: any, dsn?: string) => {
	if (dsn) {
		const sentry = new LazySentry({ dsn })
		sentry.captureException(error)
	}
}
