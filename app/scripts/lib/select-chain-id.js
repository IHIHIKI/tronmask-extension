import {
  MAINNET_CHAIN_ID,
  NILE_CHAIN_ID,
  SHASTA_CHAIN_ID,
} from '../controllers/network/enums'

const standardNetworkId = {
  '11111': MAINNET_CHAIN_ID,
  '201910292': NILE_CHAIN_ID,
  '1': SHASTA_CHAIN_ID,
}

export default function selectChainId (metamaskState) {
  const { network, provider: { chainId } } = metamaskState
  return standardNetworkId[network] || `0x${parseInt(chainId, 10).toString(16)}`
}
