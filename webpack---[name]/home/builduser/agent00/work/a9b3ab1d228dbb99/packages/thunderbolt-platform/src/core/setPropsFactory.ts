import _ from 'lodash'
import { ViewerAPI } from '../types'
import { Model } from './types'
import { SetProps, PlatformLogger } from '@wix/thunderbolt-symbols'
import { SetControllerProps } from 'feature-ooi'

const removeFunctions = (obj: object) => _.omitBy(obj, _.isFunction)
const extractFunctions = (obj: object) => _.pickBy(obj, _.isFunction)

function propsPartition(props: object, allowSecondLevelFunctions: boolean) {
	// first level
	const dataProps = removeFunctions(props)
	const functionProps = extractFunctions(props)
	// second level
	if (allowSecondLevelFunctions) {
		_.forEach(dataProps, (val, key) => {
			if (_.isObject(val) && !_.isArray(val)) {
				_.assign(
					functionProps,
					_.mapKeys(extractFunctions(val), (v, k) => `${key}.${k}`)
				)
				_.assign(dataProps, { [key]: removeFunctions(val) })
			} else {
				_.assign(dataProps, { [key]: val })
			}
		})
	}
	return { dataProps, functionProps }
}

export type CreateSetProps = (compId: string) => (partialProps: object | Promise<object>) => void
export type CreateSetPropsForOOI = (controllerCompId: string) => (partialProps: object) => void
export default function({ models, viewerAPI, logger, handlers }: { models: Model; viewerAPI: ViewerAPI; logger: PlatformLogger; handlers: { setControllerProps: SetControllerProps } }) {
	const updatePropsPromises: Array<Promise<any>> = []
	const waitForUpdatePropsPromises = () => logger.runAsyncAndReport('waitForUpdatePropsPromises', () => Promise.all(updatePropsPromises))

	function createSetProps(compId: string): SetProps {
		return (partialProps: object | Promise<object>) => {
			const _setProps = (resolvedProps: object) => {
				if (!models.propsModel[compId]) {
					models.propsModel[compId] = {}
				}
				Object.assign(models.propsModel[compId], resolvedProps)
				viewerAPI.updateProps({ [compId]: resolvedProps })
			}
			if (partialProps instanceof Promise) {
				updatePropsPromises.push(partialProps.then(_setProps))
			} else {
				_setProps(partialProps)
			}
		}
	}

	function createSetPropsForOOI(controllerCompId: string) {
		return (partialProps: object) => {
			const { functionProps, dataProps } = propsPartition(partialProps, true)
			handlers.setControllerProps(controllerCompId, dataProps, Object.keys(functionProps), (functionName, args) => functionProps[functionName](...args))
		}
	}

	return {
		createSetProps,
		createSetPropsForOOI,
		waitForUpdatePropsPromises
	}
}
