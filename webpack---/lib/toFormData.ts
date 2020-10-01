export function toFormData(payload: any) {
	return Object.keys(payload).reduce((acc, key) => {
		acc.append(key, payload[key])
		return acc
	}, new URLSearchParams())
}
