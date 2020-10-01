import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	Props,
	IPropsStore,
} from '@wix/thunderbolt-symbols'
import { ImageZoomPageConfig, ImageZoomAPI } from './types'
import { name, ImageZoomAPISymbol, IMAGE_ZOOM_QUERY, IMAGE_ZOOM_ID, RUNTIME_DELIMETER } from './symbols'
import { IUrlChangeHandler, IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'

const getZoomDataFromUrl = (
	propsStore: IPropsStore,
	urlHistoryManager: IUrlHistoryManager,
	imageDataItemIdToCompId: ImageZoomPageConfig['imageDataItemIdToCompId']
) => {
	const urlDataItem = urlHistoryManager.getParsedUrl().searchParams.get(IMAGE_ZOOM_QUERY)
	if (!urlDataItem) {
		return null
	}

	const zoomComp = propsStore.get(IMAGE_ZOOM_ID)
	const compId = urlDataItem.includes(RUNTIME_DELIMETER)
		? urlDataItem.split(RUNTIME_DELIMETER)[0]
		: imageDataItemIdToCompId[urlDataItem] || zoomComp?.compId
	return compId ? { dataItemId: urlDataItem!, compId } : null
}

export const ImageZoom = withDependencies(
	[named(PageFeatureConfigSymbol, name), Props, ImageZoomAPISymbol, UrlHistoryManagerSymbol],
	(
		{ wPhotoConfig, imageDataItemIdToCompId, nativeGalleriesComps }: ImageZoomPageConfig,
		propsStore: IPropsStore,
		zoomAPI: ImageZoomAPI,
		urlHistoryManager: IUrlHistoryManager
	): IPageWillMountHandler & IPageDidMountHandler & IPageDidUnmountHandler & IUrlChangeHandler => {
		const addWphotoOnClick = (compId: string, dataItem: string) => {
			// Platform added onClick, do nothing
			if (propsStore.get(compId).onClick) {
				return
			}
			const onClickOpenZoom = async (e: Event) => {
				// @ts-ignore
				const runTimeCompId = e.currentTarget!.id || compId
				const runtimeProps = propsStore.get(runTimeCompId)
				const props = { ...propsStore.get(compId), ...runtimeProps }
				if (props.onClickBehavior !== 'zoomMode') {
					return
				}

				const runTimeDataItemId =
					runtimeProps && runTimeCompId !== compId
						? `${runTimeCompId}${RUNTIME_DELIMETER}${dataItem}`
						: dataItem
				// TODO Or Granit 13/05/2020: can remove these 2 lines when TB-416 implemented
				e.preventDefault()
				e.stopPropagation()
				await zoomAPI.openImageZoom(runTimeCompId, runTimeDataItemId)
			}

			propsStore.update({ [compId]: { onClick: onClickOpenZoom } })
		}

		const addNativeGalleryOnClick = (compId: string) => {
			const onClickOpenZoom = async (dataItem: string) => {
				const props = propsStore.get(compId)
				if (props.imageOnClickAction !== 'zoomMode') {
					return
				}
				await zoomAPI.openImageZoom(compId, dataItem)
			}

			propsStore.update({ [compId]: { openImageZoom: onClickOpenZoom } })
		}

		return {
			async pageWillMount() {
				Object.entries(wPhotoConfig).forEach(([dataItem, compId]) => {
					addWphotoOnClick(compId, dataItem)
				})
				Object.entries(nativeGalleriesComps).forEach(([compId]) => {
					addNativeGalleryOnClick(compId)
				})
			},
			async onUrlChange() {
				const zoomInfo = getZoomDataFromUrl(propsStore, urlHistoryManager, imageDataItemIdToCompId)
				if (zoomInfo) {
					await zoomAPI.openImageZoom(zoomInfo.compId, zoomInfo.dataItemId)
				} else {
					zoomAPI.closeImageZoom()
				}
			},
			async pageDidMount() {
				const zoomInfo = getZoomDataFromUrl(propsStore, urlHistoryManager, imageDataItemIdToCompId)
				if (zoomInfo) {
					await zoomAPI.openImageZoom(zoomInfo.compId, zoomInfo.dataItemId)
				}
			},
			async pageDidUnmount() {
				zoomAPI.closeImageZoom()
			},
		}
	}
)
