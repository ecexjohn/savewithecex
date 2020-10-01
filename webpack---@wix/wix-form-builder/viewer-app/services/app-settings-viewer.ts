import { fetchWithRetries } from '../services/fetch-utils'

const CDN = 'https://settings.parastorage.com'

export const AppSettingsViewer = ({ appDefId, scope, externalId, instanceId }) => ({
  getAll: async () => {
    if (!externalId) {
      return {}
    }

    const endpoint = `v1/settings/${appDefId}/${instanceId}/${scope}/${externalId}`

    return await fetchWithRetries(CDN, endpoint, { method: 'GET' })
  },
})
