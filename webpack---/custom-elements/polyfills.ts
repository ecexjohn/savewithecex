// @ts-nocheck
export const applyPolyfillsIfNeeded = () =>
	Promise.all([
		!('customElements' in window) &&
			import('@webcomponents/custom-elements' /* webpackChunkName: "custom-elements-polyfill" */),
		!('IntersectionObserver' in window) &&
			import('intersection-observer' /* webpackChunkName: "intersection-observer-polyfill" */),
	])
