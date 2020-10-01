export const STORES_APP_DEF_ID = '1380b703-ce81-ff05-f115-39571d94dfcd'
export const CATALOG_API_BASE_URL = '/_api/catalog-reader-server'
export const CART_API_BASE_URL = '/_api/cart-server'

export enum WixStoresSdkInteraction {
	GET_PRODUCT_OPTIONS_AVAILABILITY = 'get-product-options-availability',
	GET_PRODUCT_VARIANTS = 'get-product-variants',
	GET_CURRENT_CART = 'get-current-cart',
	ON_CART_CHANGED = 'on-cart-changed',
}
