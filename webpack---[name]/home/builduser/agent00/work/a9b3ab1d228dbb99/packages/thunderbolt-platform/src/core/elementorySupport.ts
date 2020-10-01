import _ from 'lodash'
import { PlatformLogger, WixCodeBootstrapData } from '@wix/thunderbolt-symbols'

declare let self: DedicatedWorkerGlobalScope & { elementorySupport: any }

export function elementorySupportScriptUrlFor(wixCodeBootstrapData: WixCodeBootstrapData) {
	return `${wixCodeBootstrapData.wixCodePlatformBaseUrl}/wixCodeNamespacesAndElementorySupport.min.js`
}

export async function importAndInitElementorySupport({
	importScripts,
	wixCodeBootstrapData,
	wixCodeInstance,
	viewMode,
	csrfToken,
	externalBaseUrl,
	logger
}: {
	importScripts: any
	wixCodeBootstrapData: WixCodeBootstrapData
	wixCodeInstance: string
	viewMode: string
	csrfToken: string
	externalBaseUrl: string
	logger: PlatformLogger
}) {
	if (!self.elementorySupport) {
		await importScripts(elementorySupportScriptUrlFor(wixCodeBootstrapData), 'wixCodeNamespacesAndElementorySupport')
	}
	if (!self.elementorySupport) {
		const error = new Error('could not load elementorySupport')
		logger.captureError(error, { extras: { elementorySupportScriptUrl: elementorySupportScriptUrlFor(wixCodeBootstrapData) } })
		throw error
	}

	const options = { headers: { 'X-XSRF-TOKEN': csrfToken } }
	const queryParameters = `?gridAppId=${wixCodeBootstrapData.wixCodeModel.appData.codeAppId}&instance=${wixCodeInstance}&viewMode=${viewMode}`

	self.elementorySupport.baseUrl = `${externalBaseUrl}/_api/wix-code-public-dispatcher/siteview`
	self.elementorySupport.queryParameters = queryParameters
	self.elementorySupport.options = _.assign({}, self.elementorySupport.options, options)
}
