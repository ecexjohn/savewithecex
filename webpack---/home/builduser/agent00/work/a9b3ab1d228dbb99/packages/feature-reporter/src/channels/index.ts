import { BusinessLogger } from '@wix/thunderbolt-symbols'
import { getDefaultChannels } from './default'
import { getManagedChannels } from './managed'
import { getEmbeddedChannels } from './embedded'
import { BiProps } from './types'
import { LoadedScripts } from '../tag-manager/types'

export const getLoadedChannels = (biProps: BiProps, loadedScripts: LoadedScripts, businessLogger: BusinessLogger) => {
	const loadedManagedChannelNames = getLoadedChannelNames(loadedScripts)
	const managedChannels = getManagedChannels().filter((channel) =>
		loadedManagedChannelNames.some((name) => name === channel.name)
	)

	return [...getDefaultChannels(biProps, businessLogger), ...getEmbeddedChannels(biProps), ...managedChannels]
}

function getLoadedChannelNames(loadedScripts: LoadedScripts) {
	return Object.values(loadedScripts).map(({ name }) => name)
}
