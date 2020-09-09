import { cloneDeep } from 'lodash'

const version = 3
const oldTestRpc = 'https://rawtestrpc.tronmask.org/'
const newTestRpc = 'https://testrpc.tronmask.org/'

export default {
  version,

  migrate (originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData)
    versionedData.meta.version = version
    try {
      if (versionedData.data.config.provider.rpcTarget === oldTestRpc) {
        versionedData.data.config.provider.rpcTarget = newTestRpc
      }
    } catch (_) {
      // empty
    }
    return Promise.resolve(versionedData)
  },
}
