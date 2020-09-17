/*

This migration ensures previous installations
get a `firstTimeInfo` key on the tronmask state,
so that we can version notices in the future.

*/

import { cloneDeep } from 'lodash'

const version = 20

export default {
  version,

  migrate (originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData)
    versionedData.meta.version = version
    try {
      const state = versionedData.data
      const newState = transformState(state)
      versionedData.data = newState
    } catch (err) {
      console.warn(`TronMask Migration #${version}${err.stack}`)
    }
    return Promise.resolve(versionedData)
  },
}

function transformState (state) {
  const newState = state
  if ('tronmask' in newState &&
      !('firstTimeInfo' in newState.tronmask)) {
    newState.tronmask.firstTimeInfo = {
      version: '3.12.0',
      date: Date.now(),
    }
  }
  return newState
}

