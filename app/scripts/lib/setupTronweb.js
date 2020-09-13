import { createTronwebFromProvider } from '@opentron/tronweb-from-provider';
import { ethAddress } from '@opentron/tron-eth-conversions';
import EventEmitter from 'events';

// TODO....

export default function setupTronweb (tronmaskProvider) {
  // export web3 as a global, checking for usage

  const tronwebTarget = createTronwebFromProvider(tronmaskProvider)

  const propAccessEmitter = new EventEmitter()

  // Proxy
  const tronweb = new Proxy(tronwebTarget, {
    get: (...args) => {
      const [target, prop, receiver] = args
      propAccessEmitter.emit(prop, { target, prop, receiver })
      return Reflect.get(...args)
    },
  })

  // Detect if tronWeb.defaultAddress is accessed... if yes, requestAccounts,
  // set defaultAddress and refresh page?
  async function assignDefaultAddress () {
    try {
      const accounts = await tronmaskProvider.request({ method: 'eth_accounts' })
      const addressHex = accounts[0]
      if (!addressHex) {
        console.log('Tronmask not authorized yet. Monitoring tronweb.defaultAddress access.')
        // "lazily" authorize site if tronweb.defaultAddress is accessed
        propAccessEmitter.once('defaultAddress', async () => {
          await tronmaskProvider.request({ method: 'eth_requestAccounts' })
          reloadPage()
        })
        return
      }
      const defaultAddress = ethAddress.toTron(addressHex)
      tronweb.setAddress(defaultAddress)
    } catch (err) {
      console.error('error getting defaultAddress: ', err)
    }
  }

  assignDefaultAddress()

  // TODO: detect if window.tronWeb already set?
  Object.defineProperty(global, 'tronWeb', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: tronweb,
  })

  // TODO: reload page on network change?
  tronmaskProvider._publicConfigStore.subscribe((_state) => {
    // if the auto refresh on network change is false do not
    // do anything
    // if (!window.tron.autoRefreshOnNetworkChange) {
    //   return
    // }
    // const currentNetwork = state.networkVersion
    // TODO...
  })
}

// reload the page

function reloadPage () {
  global.location.reload()
}
