import ObservableStore from 'obs-store'
import log from 'loglevel'
import BN from 'bn.js'
import createId from '../lib/random-id'
import { bnToHex } from '../lib/util'
import fetchWithTimeout from '../lib/fetch-with-timeout'
import { ethAddress } from '@opentron/tron-eth-conversions'
import { contractTypes } from '../lib/tronscan-contract-types';

import {
  MAINNET,
  NILE,
  SHASTA,
  NETWORK_TYPE_TO_ID_MAP,
} from './network/enums'

const fetch = fetchWithTimeout({
  timeout: 30000,
})

export default class IncomingTransactionsController {

  constructor (opts = {}) {
    const {
      blockTracker,
      networkController,
      preferencesController,
    } = opts
    this.blockTracker = blockTracker
    this.networkController = networkController
    this.preferencesController = preferencesController
    this.getCurrentNetwork = () => networkController.getProviderConfig().type

    this._onLatestBlock = async (newBlockNumberHex) => {
      const selectedAddress = this.preferencesController.getSelectedAddress()
      const newBlockNumberDec = parseInt(newBlockNumberHex, 16)
      await this._update({
        address: selectedAddress,
        newBlockNumberDec,
      })
    }

    const initState = {
      incomingTransactions: {},
      incomingTxLastFetchedBlocksByNetwork: {
        [NILE]: null,
        [SHASTA]: null,
        [MAINNET]: null,
      }, ...opts.initState,
    }
    this.store = new ObservableStore(initState)

    this.preferencesController.store.subscribe(pairwise((prevState, currState) => {
      const { featureFlags: { showIncomingTransactions: prevShowIncomingTransactions } = {} } = prevState
      const { featureFlags: { showIncomingTransactions: currShowIncomingTransactions } = {} } = currState

      if (currShowIncomingTransactions === prevShowIncomingTransactions) {
        return
      }

      if (prevShowIncomingTransactions && !currShowIncomingTransactions) {
        this.stop()
        return
      }

      this.start()
    }))

    this.preferencesController.store.subscribe(pairwise(async (prevState, currState) => {
      const { selectedAddress: prevSelectedAddress } = prevState
      const { selectedAddress: currSelectedAddress } = currState

      if (currSelectedAddress === prevSelectedAddress) {
        return
      }

      await this._update({
        address: currSelectedAddress,
      })
    }))

    this.networkController.on('networkDidChange', async (newType) => {
      const address = this.preferencesController.getSelectedAddress()
      await this._update({
        address,
        networkType: newType,
      })
    })
  }

  start () {
    const { featureFlags = {} } = this.preferencesController.store.getState()
    const { showIncomingTransactions } = featureFlags

    if (!showIncomingTransactions) {
      return
    }

    this.blockTracker.removeListener('latest', this._onLatestBlock)
    this.blockTracker.addListener('latest', this._onLatestBlock)
  }

  stop () {
    this.blockTracker.removeListener('latest', this._onLatestBlock)
  }

  async _update ({ address, newBlockNumberDec, networkType } = {}) {
    try {
      const dataForUpdate = await this._getDataForUpdate({ address, newBlockNumberDec, networkType })
      await this._updateStateWithNewTxData(dataForUpdate)
    } catch (err) {
      log.error(err)
    }
  }

  async _getDataForUpdate ({ address, newBlockNumberDec, networkType } = {}) {
    const {
      incomingTransactions: currentIncomingTxs,
      incomingTxLastFetchedBlocksByNetwork: currentBlocksByNetwork,
    } = this.store.getState()

    const network = networkType || this.getCurrentNetwork()
    const lastFetchBlockByCurrentNetwork = currentBlocksByNetwork[network]
    let blockToFetchFrom = lastFetchBlockByCurrentNetwork || newBlockNumberDec
    if (blockToFetchFrom === undefined) {
      blockToFetchFrom = parseInt(this.blockTracker.getCurrentBlock(), 16)
    }

    const { latestIncomingTxBlockNumber, txs: newTxs } = await this._fetchAll(address, blockToFetchFrom, network)

    return {
      latestIncomingTxBlockNumber,
      newTxs,
      currentIncomingTxs,
      currentBlocksByNetwork,
      fetchedBlockNumber: blockToFetchFrom,
      network,
    }
  }

  async _updateStateWithNewTxData ({
    latestIncomingTxBlockNumber,
    newTxs,
    currentIncomingTxs,
    currentBlocksByNetwork,
    fetchedBlockNumber,
    network,
  }) {
    const newLatestBlockHashByNetwork = latestIncomingTxBlockNumber
      ? parseInt(latestIncomingTxBlockNumber, 10) + 1
      : fetchedBlockNumber + 1
    const newIncomingTransactions = {
      ...currentIncomingTxs,
    }
    newTxs.forEach((tx) => {
      newIncomingTransactions[tx.hash] = tx
    })

    this.store.updateState({
      incomingTxLastFetchedBlocksByNetwork: {
        ...currentBlocksByNetwork,
        [network]: newLatestBlockHashByNetwork,
      },
      incomingTransactions: newIncomingTransactions,
    })
  }

  async _fetchAll (address, fromBlock, networkType) {
    const fetchedTxResponse = await this._fetchTxs(address, fromBlock, networkType)
    return this._processTxFetchResponse(fetchedTxResponse)
  }

  async _fetchTxs (address, fromBlock, networkType) {
    const currentNetworkID = NETWORK_TYPE_TO_ID_MAP[networkType]?.networkId

    if (!currentNetworkID) {
      return {}
    }

    let tronscanSubdomain = 'apilist'
    if (networkType === NILE) {
      tronscanSubdomain = 'nileapi'
    } else if (networkType === SHASTA) {
      tronscanSubdomain = 'api.shasta'
    }
    const tronAddress = ethAddress.toTron(address)
    const apiUrl = `https://${tronscanSubdomain}.tronscan.org`

    /**
     *
     * https://github.com/tronscan/tronscan-frontend/blob/dev2019/document/api.md#8
     * Tronscan API params:
     *
     * @param sort: define the sequence of the records return;
     * @param limit: page size for pagination;
     * @param start: query index for pagination;
     * @param count: total number of records;
     * @param start_timestamp: query date range;
     * @param end_timestamp: query date range;
     * @return: transactions list;
     *
     */
    const url = `${apiUrl}/api/transaction?sort=-timestamp&count=true&limit=200&start=0&address=${tronAddress}`

    if (fromBlock) {
      // TODO: fromBlock not supported by tronscan
      // console.warn('fromBlock not supported by tronscan')
      // url += `&startBlock=${parseInt(fromBlock, 10)}`
    }
    const response = await fetch(url)
    const parsedResponse = await response.json()

    return {
      ...parsedResponse,
      address,
      currentNetworkID,
    }
  }

  _processTxFetchResponse ({ data = [], address, currentNetworkID }) {
    if (Array.isArray(data) && data.length > 0) {
      const remoteTxList = {}
      const remoteTxs = []
      data.forEach((tx) => {
        if (!remoteTxList[tx.hash]) {
          remoteTxs.push(this._normalizeTxFromTronscan(tx, currentNetworkID))
          remoteTxList[tx.hash] = 1
        }
      })

      const incomingTxs = remoteTxs.filter((tx) => tx.txParams.to && tx.txParams.to.toLowerCase() === address.toLowerCase())
      incomingTxs.sort((a, b) => (a.time < b.time ? -1 : 1))

      let latestIncomingTxBlockNumber = null
      incomingTxs.forEach((tx) => {
        if (
          tx.blockNumber &&
          (!latestIncomingTxBlockNumber ||
            parseInt(latestIncomingTxBlockNumber, 10) < parseInt(tx.blockNumber, 10))
        ) {
          latestIncomingTxBlockNumber = tx.blockNumber
        }
      })
      return {
        latestIncomingTxBlockNumber,
        txs: incomingTxs,
      }
    }
    return {
      latestIncomingTxBlockNumber: null,
      txs: [],
    }
  }

  _normalizeTxFromTronscan (txMeta, currentNetworkID) {

    /**
     *
     * Example data element:
     *
     *   {
     *    Events: ""
     *    SmartCalls: ""
     *    amount: "10000000"
     *    block: 9005304
     *    confirmed: true
     *    contractData: {amount: 10000000, owner_address: "TL6Cczh3GT7YC34i9c98r5fYHgs1MnuhyF", to_address: "TGMQEjzELVx8GfHroWtXUd6pVMBQtxBYK2"}
     *    contractRet: "SUCCESS"
     *    contractType: 1
     *    cost: {net_fee: 0, energy_usage: 0, energy_fee: 0, energy_usage_total: 0, origin_energy_usage: 0, …}
     *    data: ""
     *    fee: ""
     *    hash: "ac1c0cb7d8f4be15e5b43765ed7dcb3686972ab02e420a0b0b30192fc6aa1766"
     *    id: ""
     *    ownerAddress: "TL6Cczh3GT7YC34i9c98r5fYHgs1MnuhyF"
     *    result: "SUCCESS"
     *    revert: false
     *    timestamp: 1599857415000
     *    toAddress: "TGMQEjzELVx8GfHroWtXUd6pVMBQtxBYK2"
     *    toAddressList: ["TGMQEjzELVx8GfHroWtXUd6pVMBQtxBYK2"]
     *    tokenAbbr: "trx"
     *    tokenCanShow: 1
     *    tokenId: "_"
     *    tokenType: "trc10"
     *  }
     */

    /*
    const CONTRACT_TYPES = {
      TRANSFER: 1,
    }
    */

    return {
      blockNumber: `${txMeta.block}`,
      id: createId(),
      tronmaskNetworkId: currentNetworkID,
      // status: txMeta.contractRet === 'SUCCESS' ? 1 : 0,
      status: txMeta.revert ? 'failed' : 'confirmed',
      time: txMeta.timestamp,
      // contractType: contractTypes[txMeta.contractType],
      // contractData: txMeta.contractData,
      // TODO: extract this into utility function?
      tronTx: {
        raw_data: {
          contract: [{
            parameter: {
              value: txMeta.contractData,
            },
            type: contractTypes[txMeta.contractType],
          }],
        },
      },
      txParams: {
        // TODO: handle different contract types...
        from: ethAddress.fromTron(txMeta.ownerAddress),
        to: ethAddress.fromTron(txMeta.toAddress),
        value: bnToHex(new BN(txMeta.amount)),
        gas: '0x0',
        gasPrice: '0x0',
        // TODO: no nonce? random nonce?
        nonce: bnToHex(new BN(0)),
      },
      hash: `0x${txMeta.hash}`,
      // TODO: use determineTransactionCategory function...
      transactionCategory: 'incoming',
    }
  }

  _normalizeTxFromEtherscan (txMeta, currentNetworkID) {
    const time = parseInt(txMeta.timeStamp, 10) * 1000
    const status = txMeta.isError === '0' ? 'confirmed' : 'failed'
    return {
      blockNumber: txMeta.blockNumber,
      id: createId(),
      tronmaskNetworkId: currentNetworkID,
      status,
      time,
      txParams: {
        from: txMeta.from,
        gas: bnToHex(new BN(txMeta.gas)),
        gasPrice: bnToHex(new BN(txMeta.gasPrice)),
        nonce: bnToHex(new BN(txMeta.nonce)),
        to: txMeta.to,
        value: bnToHex(new BN(txMeta.value)),
      },
      hash: txMeta.hash,
      transactionCategory: 'incoming',
    }
  }
}

function pairwise (fn) {
  let first = true
  let cache
  return (value) => {
    try {
      if (first) {
        first = false
        return fn(value, value)
      }
      return fn(cache, value)
    } finally {
      cache = value
    }
  }
}
