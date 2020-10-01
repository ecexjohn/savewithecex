import { withDependencies } from '@wix/thunderbolt-ioc'
import { ComponentsStylesOverridesSymbol, CompsLifeCycleSym, IComponentsStylesOverrides, ICompsLifeCycle } from '@wix/thunderbolt-symbols'

export type PlatformViewPortAPI = {
	onViewportEnter(compId: string, cb: Function): void
	onViewportLeave(compId: string, cb: Function): void
	appWillLoadPage(): void
}

const getIntersectionObserverOptions = () => {
	if (process.env.browser) {
		const wixAds = window!.document.getElementById('WIX_ADS')

		if (wixAds) {
			return { rootMargin: `-${wixAds.offsetHeight}px 0px 0px 0px` }
		}
	}
	return {}
}

export const platformViewportAPI = withDependencies(
	[ComponentsStylesOverridesSymbol, CompsLifeCycleSym],
	(componentsStylesOverrides: IComponentsStylesOverrides, compsLifeCycle: ICompsLifeCycle): PlatformViewPortAPI => {
		const intersectionObservers: Array<IntersectionObserver> = []
		let options: object

		const getTarget = async (compId: string) => {
			const target = document.querySelector(`#${compId}`)
			if (target) {
				return target
			}
			return compsLifeCycle.waitForComponentToRender(compId)
		}

		async function onViewportEnter(compId: string, cb: Function) {
			if (process.env.browser) {
				const target = await getTarget(compId)
				if (target) {
					options = options || getIntersectionObserverOptions()
					const onViewportEnterHandler = (entries: Array<IntersectionObserverEntry>) => {
						entries
							.filter((intersectionEntry) => intersectionEntry.target.id === compId)
							.forEach((intersectionEntry) => {
								const isIntersecting = intersectionEntry.isIntersecting
								const isHidden = componentsStylesOverrides.isHidden(compId)
								if (isIntersecting && !isHidden) {
									cb([{ type: 'viewportEnter' }])
								}
							})
					}
					const intersectionObserver = new window.IntersectionObserver(onViewportEnterHandler, options)
					intersectionObservers.push(intersectionObserver)
					intersectionObserver.observe(target as HTMLElement)
				}
			}
		}
		async function onViewportLeave(compId: string, cb: Function) {
			if (process.env.browser) {
				const target = await getTarget(compId)
				if (target) {
					options = options || getIntersectionObserverOptions()
					let isFirstCall = true
					const onViewportLeaveHandler = (entries: Array<IntersectionObserverEntry>) => {
						entries
							.filter((intersectionEntry) => intersectionEntry.target.id === compId)
							.forEach((intersectionEntry) => {
								const isIntersecting = intersectionEntry.isIntersecting
								const isHidden = componentsStylesOverrides.isHidden(compId)
								if (!isIntersecting && !isHidden && !isFirstCall) {
									cb([{ type: 'viewportLeave' }])
								}
								isFirstCall = false
							})
					}
					const intersectionObserver = new window.IntersectionObserver(onViewportLeaveHandler, options)
					intersectionObservers.push(intersectionObserver)
					intersectionObserver.observe(target as HTMLElement)
				}
			}
		}

		function appWillLoadPage() {
			intersectionObservers.forEach((intersectionObserver) => intersectionObserver.disconnect())
		}

		return {
			onViewportEnter,
			onViewportLeave,
			appWillLoadPage
		}
	}
)
