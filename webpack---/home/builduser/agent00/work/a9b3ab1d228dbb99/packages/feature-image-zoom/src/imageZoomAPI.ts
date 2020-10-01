import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { PageFeatureConfigSymbol, IPropsStore, IStructureAPI, Props, StructureAPI } from '@wix/thunderbolt-symbols'
import { name, IMAGE_ZOOM_QUERY, IMAGE_ZOOM_ID } from './symbols'
import { ImageZoomPageConfig, ImageZoomAPI, ImageZoomGalleryProps, ImageZoomItem } from './types'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { TpaGalleryProps, Image, SlideShowGalleryProps, SlideShowGalleryItem } from '@wix/thunderbolt-components-native'

export const ImageZoomAPIImpl = withDependencies(
	[named(PageFeatureConfigSymbol, name), Props, StructureAPI, SiteScrollBlockerSymbol, UrlHistoryManagerSymbol],
	(
		{ isPopupPage, imageZoomCompType, tpaGalleriesComps, nativeGalleriesComps, deviceType }: ImageZoomPageConfig,
		propsStore: IPropsStore,
		structureAPI: IStructureAPI,
		siteScrollBlocker: ISiteScrollBlocker,
		urlHistoryManager: IUrlHistoryManager
	): ImageZoomAPI => {
		const setZoomDataToUrl = (dataItemId: string | null) => {
			const url = urlHistoryManager.getParsedUrl()
			if (dataItemId) {
				url.searchParams.set(IMAGE_ZOOM_QUERY, dataItemId)
			} else {
				url.searchParams.delete(IMAGE_ZOOM_QUERY)
			}
			urlHistoryManager.pushUrlState(url)
		}

		const addComponent = async (imageZoomProps: ImageZoomGalleryProps) => {
			propsStore.update({ [IMAGE_ZOOM_ID]: imageZoomProps })
			await structureAPI.addComponentToDynamicStructure(IMAGE_ZOOM_ID, {
				componentType: imageZoomCompType,
				components: [],
			})
			siteScrollBlocker.setSiteScrollingBlocked(true, IMAGE_ZOOM_ID)
		}
		const removeComponent = () => {
			if (!structureAPI.isComponentInDynamicStructure(IMAGE_ZOOM_ID)) {
				return
			}
			structureAPI.removeComponentFromDynamicStructure(IMAGE_ZOOM_ID)
			siteScrollBlocker.setSiteScrollingBlocked(false, IMAGE_ZOOM_ID)
		}

		const closeImageZoom = () => {
			removeComponent()

			setZoomDataToUrl(null)
		}
		const onImageChange = (dataItemId: string) => {
			setZoomDataToUrl(dataItemId)
		}

		const convertTpaGalleryImagesToImageZoomFormat = (compProps: TpaGalleryProps, compId: string) => {
			// @ts-ignore
			return compProps.images.map((image: Image) => convertImagePropsToImageZoomFormat(image, compId))
		}

		// TODO - change to NativeGalleryProps and NativeGalleryItem once all are implemented
		const convertNativeGalleryImagesToImageZoomFormat = (compProps: SlideShowGalleryProps, compId: string) => {
			return compProps.items.map(({ image, dataId, ...rest }: SlideShowGalleryItem) =>
				convertImagePropsToImageZoomFormat({ id: dataId, ...image, ...rest }, compId)
			)
		}

		const convertImagePropsToImageZoomFormat = (image: any, compId: string): ImageZoomItem => {
			const isMobile = deviceType === 'Smartphone'
			const { id, uri, alt, width, height, href, link, title, description, crop } = image
			// When there's no `link` in WPhoto the `link` value is { href: undefined } which is something we don't want to pass EE
			const filteredLink = link?.href ? { link } : {}
			const linkProp = href ? { link: { ...link, href } } : filteredLink
			return {
				id,
				containerId: compId,
				uri,
				alt,
				name: image.name,
				width,
				height,
				title,
				description,
				...linkProp,
				...(!isMobile && { crop }),
			}
		}

		const openImageZoom = async (compId: string, dataItemId: string) => {
			const [templateId] = compId.split('__')
			const compProps = { ...propsStore.get(templateId), ...propsStore.get(compId) } as any
			if (structureAPI.isComponentInDynamicStructure(IMAGE_ZOOM_ID)) {
				return
			}

			// compId is either of a gallery or a wPhoto
			const isTpaGallery = tpaGalleriesComps.hasOwnProperty(compId)
			const isNativeGallery = nativeGalleriesComps.hasOwnProperty(compId)

			let images
			if (isTpaGallery) {
				images = convertTpaGalleryImagesToImageZoomFormat(compProps, compId)
			} else if (isNativeGallery) {
				images = convertNativeGalleryImagesToImageZoomFormat(compProps, compId)
			} else {
				images = [convertImagePropsToImageZoomFormat(compProps, compId)]
			}

			const imageZoomProps: ImageZoomGalleryProps = {
				images,
				onClose: closeImageZoom,
				onImageChange,
				dataItemId,
				compId,
				deviceType,
			}
			await addComponent(imageZoomProps)

			if (!isPopupPage) {
				setZoomDataToUrl(dataItemId)
			}
		}

		return {
			openImageZoom,
			closeImageZoom,
		}
	}
)
