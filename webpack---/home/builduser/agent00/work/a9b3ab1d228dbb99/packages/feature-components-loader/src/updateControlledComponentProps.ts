import {
	CompProps,
	IPropsStore,
	Props,
	BusinessLogger,
	BusinessLoggerSymbol,
	ReporterSymbol,
	IReporterApi,
} from '@wix/thunderbolt-symbols'
import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { CreateCompControllerArgs } from './types'

type PlatformOnPropsChangedHandler = (overrideProps: CompProps) => void
export const controlledComponentFactory = withDependencies(
	[Props, optional(BusinessLoggerSymbol), optional(ReporterSymbol)],
	(propsStore: IPropsStore, businessLogger: BusinessLogger, reporter?: IReporterApi) => {
		const platformOnPropsChangedHandler: { [pageId: string]: (overrideProps: { [id: string]: any }) => void } = {}

		const createCompControllerArgs: CreateCompControllerArgs = (displayedId: string) => {
			return {
				...(reporter && { trackEvent: reporter.trackEvent }),
				// @ts-ignore
				reportBi: (params, ctx) => {
					return businessLogger.logger.log(params, ctx)
				},
				updateProps: (overrideProps) => {
					propsStore.update({ [displayedId]: overrideProps })
					const pageId = propsStore.getContextIdOfCompId(displayedId)
					if (!pageId) {
						return
					}
					if (pageId === 'masterPage') {
						// update all models in the platform in case the component is on the master page since the platform always merges masterPage to the models.
						Object.values(platformOnPropsChangedHandler).forEach((handler) =>
							handler({ [displayedId]: overrideProps })
						)
						return
					}
					if (platformOnPropsChangedHandler[pageId]) {
						platformOnPropsChangedHandler[pageId]({ [displayedId]: overrideProps })
					}
				},
			}
		}

		return {
			extendRendererProps() {
				return {
					createCompControllerArgs,
				}
			},
			getSdkHandlers() {
				return {
					registerOnPropsChangedHandler(pageId: string, handler: PlatformOnPropsChangedHandler) {
						platformOnPropsChangedHandler[pageId] = handler
					},
				}
			},
		}
	}
)
