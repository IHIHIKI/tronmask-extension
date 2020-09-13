import { createTronwebFromProvider } from '@opentron/tronweb-from-provider';

// TODO....

export default function setupTronweb (tronmaskProvider) {
  // export web3 as a global, checking for usage

  const tronweb = createTronwebFromProvider(tronmaskProvider)

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

/*
function triggerReset () {
  global.location.reload()
}
*/
