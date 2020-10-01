import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

const noop = () => {}

const warning = (name: string) => console.log('need to implement', name)

export const EmptyHandlers = withDependencies(
	[],
	(): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				applicationLoaded: () => warning('applicationLoaded'),
				applicationLoadingStep: () => warning('applicationLoadingStep'),
				getSiteRevision: noop,
				getDeviceType: noop,
				toWixDate: noop,
				getCompId: noop,
				getOrigCompId: noop,
				getWidth: noop,
				getLocale: noop,
				getCacheKiller: noop,
				getTarget: noop,
				getInstanceId: noop,
				getSignDate: noop,
				getUid: noop,
				getPermissions: noop,
				getIpAndPort: noop,
				getDemoMode: noop,
				getInstanceValue: noop,
				getSiteOwnerId: noop,
				getImageUrl: noop,
				getResizedImageUrl: noop,
				getAudioUrl: noop,
				getDocumentUrl: noop,
				getSwfUrl: noop,
				getPreviewSecureMusicUrl: noop,
				getStyleParams: noop,
				getStyleColorByKey: noop,
				getColorByreference: noop,
				getSiteTextPresets: noop,
				getFontsSpriteUrl: noop,
				getStyleFontByKey: noop,
				getStyleFontByReference: noop,
				getSiteColors: noop,
				getViewModeInternal: noop,
				postMessage: noop,
			}
		},
	})
)
