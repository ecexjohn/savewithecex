import {
	loadAmbassadorWixEcomCartServicesWebHttp,
	loadAmbassadorWixEcomCatalogReaderWebHttp,
	loadCartMapper,
	loadProductOptionsAvailabilityMapper,
	loadProductVariantsMapper,
} from './dynamicImports'
import { CART_API_BASE_URL, CATALOG_API_BASE_URL, STORES_APP_DEF_ID, WixStoresSdkInteraction } from './constants'
import { AppPublicApiUtils, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import { FedopsLogger } from '@wix/fedops-logger'

export class WixStoresSdk {
	constructor(
		private sessionServiceApi: SessionServiceAPI,
		private fedopsLogger: FedopsLogger,
		private appsPublicApisUtils: AppPublicApiUtils
	) {}

	async getProductOptionsAvailability(productId: string, options: { [key: string]: string } = {}): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresSdkInteraction.GET_PRODUCT_OPTIONS_AVAILABILITY)
		const { WixEcommerceCatalogReaderWeb } = await loadAmbassadorWixEcomCatalogReaderWebHttp()
		const { productOptionsAvailabilityMapper } = await loadProductOptionsAvailabilityMapper()

		const catalogApiFactory = WixEcommerceCatalogReaderWeb(CATALOG_API_BASE_URL).CatalogReadApi()
		const catalogApi = catalogApiFactory(this.getRequestHeaders())

		const res = await catalogApi.productOptionsAvailability({ id: productId, options })
		this.fedopsLogger.interactionEnded(WixStoresSdkInteraction.GET_PRODUCT_OPTIONS_AVAILABILITY)
		return productOptionsAvailabilityMapper(res as any)
	}

	async getProductVariants(productId: string, options: { [key: string]: string } = {}): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresSdkInteraction.GET_PRODUCT_VARIANTS)
		const { WixEcommerceCatalogReaderWeb } = await loadAmbassadorWixEcomCatalogReaderWebHttp()
		const { productVariantsParamMapper, productVariantsMapper } = await loadProductVariantsMapper()

		const catalogApiFactory = WixEcommerceCatalogReaderWeb(CATALOG_API_BASE_URL).CatalogReadApi()
		const catalogApi = catalogApiFactory(this.getRequestHeaders())

		const res = await catalogApi.queryVariants({ id: productId, ...productVariantsParamMapper(options) })
		this.fedopsLogger.interactionEnded(WixStoresSdkInteraction.GET_PRODUCT_VARIANTS)
		return productVariantsMapper(res as any)
	}

	async getCurrentCart(): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresSdkInteraction.GET_CURRENT_CART)
		const { WixEcommerceCartServicesWeb } = await loadAmbassadorWixEcomCartServicesWebHttp()
		const { cartMapperClient } = await loadCartMapper()

		const cartApiFactory = WixEcommerceCartServicesWeb(CART_API_BASE_URL).Carts()
		const cartApi = cartApiFactory(this.getRequestHeaders())

		const res = await cartApi.getCurrentCart({})
		this.fedopsLogger.interactionEnded(WixStoresSdkInteraction.GET_CURRENT_CART)
		return cartMapperClient(res.cart as any, this.getInstanceFunc)
	}

	onCartChanged(handler: (cart: any) => void) {
		this.fedopsLogger.interactionStarted(WixStoresSdkInteraction.ON_CART_CHANGED)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then((api) => {
			this.fedopsLogger.interactionEnded(WixStoresSdkInteraction.ON_CART_CHANGED)
			api.registerOnCartChangeListener(() => {
				this.getCurrentCart().then((cart) => handler(cart))
			})
		})
	}

	private getInstanceFunc = () => this.sessionServiceApi.getInstance(STORES_APP_DEF_ID)

	private getRequestHeaders = () => ({
		Authorization: this.getInstanceFunc(),
		Accept: 'application/json',
	})
}
