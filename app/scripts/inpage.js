// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
const cleanContextForImports = () => {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('TronMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
const restoreContextAfterImports = () => {
  try {
    global.define = __define
  } catch (_) {
    console.warn('TronMask - global.define could not be overwritten.')
  }
}

cleanContextForImports()

/* eslint-disable import/first */
import log from 'loglevel'
import LocalMessageDuplexStream from 'post-message-stream'
import { initProvider } from '@tronmask/inpage-provider'

// TODO:deprecate:2020
import setupWeb3 from './lib/setupWeb3'
import setupTronweb from './lib/setupTronweb'
/* eslint-enable import/first */

restoreContextAfterImports()

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

//
// setup plugin communication
//

// setup background connection
const metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

const provider = initProvider({
  connectionStream: metamaskStream,
})

if (typeof window.tronWeb !== 'undefined') {
  throw new Error(`TronMask detected another tronWeb.
     TronMask will not work reliably with another Tron wallet extension.
     This usually happens if you have TronLink installed,
     or TronMask and another Tron extension. Please remove one
     and try again.`)
}

setupTronweb(provider)

// TODO:deprecate:2020
// Setup web3

/*
if (typeof window.web3 !== 'undefined') {
  throw new Error(`TronMask detected another web3.
     TronMask will not work reliably with another web3 extension.
     This usually happens if you have two TronMasks installed,
     or TronMask and another web3 extension. Please remove one
     and try again.`)
}

// proxy web3, assign to window, and set up site auto reload
setupWeb3(log)
*/
