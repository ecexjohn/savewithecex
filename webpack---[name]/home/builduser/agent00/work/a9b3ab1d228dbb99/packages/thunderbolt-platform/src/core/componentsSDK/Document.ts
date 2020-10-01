import _ from 'lodash'
import { ComponentSdkFactory } from '@wix/thunderbolt-platform-types'
import { Model } from '../types'
import { WixSelector } from '../wixSelector'

export function DocumentSdkFactory({ wixSelector, models }: { wixSelector: WixSelector; models: Model }): ComponentSdkFactory {
	const findCompId = (compType: string) => _.findKey(models.structureModel, { componentType: compType })

	return ({ controllerCompId }) => ({
		get type() {
			return '$w.Document'
		},
		get children() {
			return ['Page', 'HeaderContainer', 'FooterContainer'].map((compType) => {
				const compId = findCompId(compType) as string
				return wixSelector.getInstance({ controllerCompId, compId, compType, role: 'Document' })
			})
		},
		get background() {
			const compType = 'PageBackground'
			const compId = findCompId(compType) as string
			return wixSelector.getInstance({ controllerCompId, compId, compType, role: 'Document' }).background
		}
	})
}
