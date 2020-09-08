export const MAINNET = 'mainnet'
export const NILE = 'nile'
export const SHASTA = 'shasta'
export const LOCALHOST = 'localhost'

export const MAINNET_NETWORK_ID = '11111'
export const NILE_NETWORK_ID = '201910292'
export const SHASTA_NETWORK_ID = '1'

export const MAINNET_CHAIN_ID = '0x2b67'
export const NILE_CHAIN_ID = '0xc08e814'
export const SHASTA_CHAIN_ID = '0x1'

export const MAINNET_DISPLAY_NAME = 'Main Tron Network'
export const NILE_DISPLAY_NAME = 'Nile'
export const SHASTA_DISPLAY_NAME = 'Shasta'

export const INFURA_PROVIDER_TYPES = []

export const NETWORK_TYPE_TO_ID_MAP = {
  [MAINNET]: { networkId: MAINNET_NETWORK_ID, chainId: MAINNET_CHAIN_ID },
  [NILE]: { networkId: NILE_NETWORK_ID, chainId: NILE_CHAIN_ID },
  [SHASTA]: { networkId: SHASTA_NETWORK_ID, chainId: SHASTA_CHAIN_ID },
}

export const NETWORK_TO_NAME_MAP = {
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [NILE]: NILE_DISPLAY_NAME,
  [SHASTA]: SHASTA_DISPLAY_NAME,

  [MAINNET_NETWORK_ID]: MAINNET_DISPLAY_NAME,
  [NILE_NETWORK_ID]: NILE_DISPLAY_NAME,
  [SHASTA_NETWORK_ID]: SHASTA_DISPLAY_NAME,

  [MAINNET_CHAIN_ID]: MAINNET_DISPLAY_NAME,
  [NILE_CHAIN_ID]: NILE_DISPLAY_NAME,
  [SHASTA_CHAIN_ID]: SHASTA_DISPLAY_NAME,
}
