const defaultNetworksData = [
  {
    labelKey: 'mainnet',
    iconColor: '#9064FF',
    providerType: 'mainnet',
    rpcUrl: 'https://java-tron.opentron.org',
    chainId: '11111',
    ticker: 'TRX',
    blockExplorerUrl: 'https://tronscan.org',
  },
  {
    labelKey: 'nile',
    iconColor: '#FF4A8D',
    providerType: 'nile',
    rpcUrl: 'https://java-tron-nile.opentron.org',
    chainId: '201910292',
    ticker: 'TRX',
    blockExplorerUrl: 'https://nile.tronscan.org',
  },
  {
    labelKey: 'shasta',
    iconColor: '#29B6AF',
    providerType: 'shasta',
    rpcUrl: 'https://shasta.api.trongrid.io',
    chainId: '1',
    ticker: 'TRX',
    blockExplorerUrl: 'https://shasta.tronscan.org',
  },
  {
    labelKey: 'localhost',
    iconColor: 'white',
    border: '1px solid #6A737D',
    providerType: 'localhost',
    rpcUrl: 'http://localhost:8545/',
    blockExplorerUrl: 'https://etherscan.io',
  },
]

export {
  defaultNetworksData,
}
