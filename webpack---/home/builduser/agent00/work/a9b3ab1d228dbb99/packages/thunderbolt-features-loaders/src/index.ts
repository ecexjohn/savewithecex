import { FeaturesLoaders } from '@wix/thunderbolt-features'

export const featuresLoaders: Partial<FeaturesLoaders> = {
	router: () => import('feature-router' /* webpackChunkName: "router" */),
	landingPage: () => import('feature-landing-page' /* webpackChunkName: "landingPage" */),
	animations: () => import('feature-animations' /* webpackChunkName: "animations" */),
	backgroundScrub: () => import('feature-background-scrub' /* webpackChunkName: "backgroundScrub" */),
	expandableMenu: () => import('feature-expandable-menu' /* webpackChunkName: "expandableMenu" */),
	tinyMenu: () => import('feature-tiny-menu' /* webpackChunkName: "tinyMenu" */),
	verticalMenu: () => import('feature-vertical-menu' /* webpackChunkName: "verticalMenu" */),
	dropdownMenu: () => import('feature-dropdown-menu' /* webpackChunkName: "dropdownMenu" */),
	siteWixCodeSdk: () => import('feature-site-wix-code-sdk' /* webpackChunkName: "siteWixCodeSdk" */),
	popups: () => import('feature-popups' /* webpackChunkName: "popups" */),
	windowWixCodeSdk: () => import('feature-window-wix-code-sdk' /* webpackChunkName: "windowWixCodeSdk" */),
	seo: () => import('feature-seo' /* webpackChunkName: "seo" */),
	locationWixCodeSdk: () => import('feature-location-wix-code-sdk' /* webpackChunkName: "locationWixCodeSdk" */),
	siteMembers: () => import('feature-site-members' /* webpackChunkName: "siteMembers" */),
	siteScrollBlocker: () => import('feature-site-scroll-blocker' /* webpackChunkName: "siteScrollBlocker" */),
	pageTransitions: () => import('feature-page-transitions' /* webpackChunkName: "pageTransitions" */),

	siteMembersWixCodeSdk: () =>
		import('feature-site-members-wix-code-sdk' /* webpackChunkName: "siteMembersWixCodeSdk" */),

	clickHandlerRegistrar: () =>
		import('feature-click-handler-registrar' /* webpackChunkName: "clickHandlerRegistrar" */),

	seoWixCodeSdk: () => import('feature-seo-wix-code-sdk' /* webpackChunkName: "seoWixCodeSdk" */),
	autoDisplayLightbox: () => import('feature-auto-display-lightbox' /* webpackChunkName: "autoDisplayLightbox" */),
	renderer: () => import('feature-react-renderer' /* webpackChunkName: "renderer" */),
	ooi: () => import('feature-ooi' /* webpackChunkName: "ooi" */),
	imageZoom: () => import('feature-image-zoom' /* webpackChunkName: "imageZoom" */),
	wixEmbedsApi: () => import('feature-wix-embeds-api' /* webpackChunkName: "wixEmbedsApi" */),
	protectedPages: () => import('feature-protected-pages' /* webpackChunkName: "protectedPages" */),
	multilingual: () => import('feature-multilingual' /* webpackChunkName: "multilingual" */),
	accessibility: () => import('feature-accessibility' /* webpackChunkName: "accessibility" */),
	tpa: () => import('feature-tpa' /* webpackChunkName: "tpa" */),
	consentPolicy: () => import('feature-consent-policy' /* webpackChunkName: "consentPolicy" */),
	sessionManager: () => import('feature-session-manager' /* webpackChunkName: "sessionManager" */),
	reporter: () => import('feature-reporter' /* webpackChunkName: "reporter" */),
	loginSocialBar: () => import('feature-login-social-bar' /* webpackChunkName: "loginSocialBar" */),
	qaApi: () => import('feature-qa-api' /* webpackChunkName: "qaApi" */),
	pages: () => import('feature-pages' /* webpackChunkName: "pages" */),
	scrollVar: () => import('feature-scroll-var' /* webpackChunkName: "scrollVar" */),
	seoTpa: () => import('feature-seo-tpa' /* webpackChunkName: "seoTpa" */),
	pageScroll: () => import('feature-page-scroll' /* webpackChunkName: "pageScroll" */),
	cookiesManager: () => import('feature-cookies-manager' /* webpackChunkName: "cookiesManager" */),
	menuContainer: () => import('feature-menu-container' /* webpackChunkName: "menuContainer" */),
	businessLogger: () => import('feature-business-logger' /* webpackChunkName: "businessLogger" */),
	socialUrl: () => import('feature-social-url' /* webpackChunkName: "socialUrl" */),
	platformPubsub: () => import('feature-platform-pubsub' /* webpackChunkName: "platformPubsub" */),
	windowScroll: () => import('feature-window-scroll' /* webpackChunkName: "windowScroll" */),
	navigation: () => import('feature-navigation' /* webpackChunkName: "navigation" */),
	scrollToAnchor: () => import('feature-scroll-to-anchor' /* webpackChunkName: "scrollToAnchor" */),
	scrollRestoration: () => import('feature-scroll-restoration' /* webpackChunkName: "scrollRestoration" */),

	passwordProtectedPage: () =>
		import('feature-password-protected-page' /* webpackChunkName: "passwordProtectedPage" */),

	dynamicPages: () => import('feature-dynamic-pages' /* webpackChunkName: "dynamicPages" */),
	backgroundGroup: () => import('feature-background-group' /* webpackChunkName: "backgroundGroup" */),
	commonConfig: () => import('feature-common-config' /* webpackChunkName: "commonConfig" */),
	currentUrl: () => import('feature-current-url' /* webpackChunkName: "currentUrl" */),
	sosp: () => import('feature-sosp' /* webpackChunkName: "sosp" */),
	languageSelector: () => import('feature-language-selector' /* webpackChunkName: "languageSelector" */),
	quickActionBar: () => import('feature-quick-action-bar' /* webpackChunkName: "quickActionBar" */),

	comboboxinputNavigation: () =>
		import('feature-comboboxinput-navigation' /* webpackChunkName: "comboboxinputNavigation" */),

	windowMessageRegistrar: () =>
		import('feature-window-message-registrar' /* webpackChunkName: "windowMessageRegistrar" */),

	paidPlansWixCodeSdk: () => import('feature-paid-plans-wix-code-sdk' /* webpackChunkName: "paidPlansWixCodeSdk" */),
	wixEventsWixCodeSdk: () => import('feature-events-wix-code-sdk' /* webpackChunkName: "wixEventsWixCodeSdk" */),
	testApi: () => import('feature-test-api' /* webpackChunkName: "testApi" */),
	activePopup: () => import('feature-active-popup' /* webpackChunkName: "activePopup" */),
	searchWixCodeSdk: () => import('feature-search-wix-code-sdk' /* webpackChunkName: "searchWixCodeSdk" */),
	datePicker: () => import('feature-date-picker' /* webpackChunkName: "datePicker" */),
	debug: () => import('feature-debug' /* webpackChunkName: "debug" */),
	reducedMotion: () => import('feature-reduced-motion' /* webpackChunkName: "reducedMotion" */),
	tpaCommons: () => import('feature-tpa-commons' /* webpackChunkName: "tpaCommons" */),
	translations: () => import('feature-translations' /* webpackChunkName: "translations" */),
	pageAnchors: () => import('feature-page-anchors' /* webpackChunkName: "pageAnchors" */),
	componentsLoader: () => import('@wix/thunderbolt-components-loader' /* webpackChunkName: "componentsLoader" */),
	componentsReact: () => import('thunderbolt-components-react' /* webpackChunkName: "componentsReact" */),
	welcomeScreen: () => import('feature-welcome-screen' /* webpackChunkName: "welcomeScreen" */),
	warmupData: () => import('feature-warmup-data' /* webpackChunkName: "warmupData" */),

	wixCustomElementComponent: () =>
		import('feature-wix-custom-element-component' /* webpackChunkName: "wixCustomElementComponent" */),

	assetsLoader: () => import('feature-assets-loader' /* webpackChunkName: "assetsLoader" */),
	containerSlider: () => import('feature-container-slider' /* webpackChunkName: "containerSlider" */),
	tpaWorkerFeature: () => import('feature-tpa-worker' /* webpackChunkName: "tpaWorkerFeature" */),
	ooiTpaSharedConfig: () => import('feature-ooi-tpa-shared-config' /* webpackChunkName: "ooiTpaSharedConfig" */),
	componentsQaApi: () => import('feature-components-qa-api' /* webpackChunkName: "componentsqaapi" */),
	onloadCompsBehaviors: () => import('feature-onload-comps-behaviors' /* webpackChunkName: "onloadCompsBehaviors" */),
	chat: () => import('feature-chat' /* webpackChunkName: "chat" */),
	customUrlMapper: () => import('feature-custom-url-mapper' /* webpackChunkName: "customUrlMapper" */),
	screenIn: () => import('feature-screen-in' /* webpackChunkName: "screenIn" */),
	stores: () => import('feature-stores' /* webpackChunkName: "stores" */),

	animationsWixCodeSdk: () =>
		import('feature-animations-wix-code-sdk' /* webpackChunkName: "animationsWixCodeSdk" */),

	googleMap: () => import('feature-google-map' /* webpackChunkName: "googleMap" */),
	coBranding: () => import('feature-co-branding' /* webpackChunkName: "coBranding" */),
	structureApi: () => import('feature-structure-api' /* webpackChunkName: "structureApi" */),
}
