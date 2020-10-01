import _ from 'lodash'

const TPA_WIDGET_TYPE = 'wysiwyg.viewer.components.tpapps.TPAWidget'
const TPA_WIDGET_NATIVE_TYPE = 'wysiwyg.viewer.components.tpapps.TPAWidgetNative'

export class TypeUtils {
    constructor(typesData) {
        this._typesData = typesData
    }

    getSdkType(viewerType, tpaWidgetId) {
        const typesData = this._typesData
        const sdkTypeByViewerType = typesData.sdkTypeByViewerType
        const sdkTypeByWidgetId = typesData.sdkTypeByWidgetId
        const defaultSdkType = typesData.defaultSdkType
        return sdkTypeByWidgetId[tpaWidgetId] || sdkTypeByViewerType[viewerType] || defaultSdkType
    }

    getFullSdkType(viewerType, tpaWidgetId) {
        return `$w.${this.getSdkType(viewerType, tpaWidgetId)}`
    }

    getPotentialViewerTypes(sdkType) {
        const typesData = this._typesData
        const sdkTypeByViewerType = typesData.sdkTypeByViewerType
        const sdkTypeByWidgetId = typesData.sdkTypeByWidgetId

        const types = _.keys(sdkTypeByViewerType)
        const resultViewerTypes = types.filter(viewerType => sdkTypeByViewerType[viewerType] === sdkType)
        const isPotentiallyTPA = _.includes(_.values(sdkTypeByWidgetId), sdkType)
        if (isPotentiallyTPA) {
            resultViewerTypes.push(TPA_WIDGET_TYPE, TPA_WIDGET_NATIVE_TYPE)
        }
        return resultViewerTypes
    }

    get Types() {
        const typesData = this._typesData
        const sdkTypeByViewerType = typesData.sdkTypeByViewerType
        const sdkTypeByWidgetId = typesData.sdkTypeByWidgetId

        const allSdkTypes = _.uniq(_.values(sdkTypeByViewerType).concat(_.values(sdkTypeByWidgetId)))
        return _.zipObject(allSdkTypes, allSdkTypes)
    }

    get defaultSdkType() {
        const typesData = this._typesData
        return typesData.defaultSdkType
    }

    setType(viewerType, sdkType) {
        const sdkTypeByViewerType = this._typesData.sdkTypeByViewerType
        sdkTypeByViewerType[viewerType] = sdkType
    }
}