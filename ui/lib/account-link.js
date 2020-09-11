import { ethAddress } from '@opentron/tron-eth-conversions'

export default function getAccountLink (hexAddress, network, rpcPrefs) {
  const address = ethAddress.toTron(hexAddress)
  if (rpcPrefs && rpcPrefs.blockExplorerUrl) {
    return `${rpcPrefs.blockExplorerUrl.replace(/\/+$/u, '')}/#/address/${address}`
  }

  // eslint-disable-next-line radix
  const net = parseInt(network)
  switch (net) {
    case 11111: // main net
      return `https://tronscan.org/#/address/${address}`
    case 201910292: // morden test net
      return `https://nile.tronscan.org/#/address/${address}`
    case 1: // shasta
      return `https://shasta.tronscan.org/#/address/${address}`
    default:
      return ''
  }
}
