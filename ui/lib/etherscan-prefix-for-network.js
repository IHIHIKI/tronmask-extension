import * as networkEnums from '../../app/scripts/controllers/network/enums'

/**
 * Gets the etherscan.io URL prefix for a given network ID.
 *
 * @param {string} networkId - The network ID to get the prefix for.
 * @returns {string} The etherscan.io URL prefix for the given network ID.
 */
export function getEtherscanNetworkPrefix (networkId) {
  switch (networkId) {
    case networkEnums.NILE_NETWORK_ID:
      return 'nile.'
    case networkEnums.SHASTA_NETWORK_ID:
      return 'shasta.'
    default: // also covers mainnet
      return ''
  }
}
