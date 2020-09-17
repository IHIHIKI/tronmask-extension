import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import createScaffoldMiddleware from 'json-rpc-engine/src/createScaffoldMiddleware'
import createWalletSubprovider from 'eth-json-rpc-middleware/wallet'
import { createPendingNonceMiddleware, createPendingTxMiddleware } from './middleware/pending'

export default function createTronmaskMiddleware ({
  version,
  getAccounts,
  processTransaction,
  processSignTronTransaction,
  processEthSignMessage,
  processTypedMessage,
  processTypedMessageV3,
  processTypedMessageV4,
  processPersonalMessage,
  processDecryptMessage,
  processEncryptionPublicKey,
  getPendingNonce,
  getPendingTransactionByHash,
}) {
  const tronmaskMiddleware = mergeMiddleware([
    createScaffoldMiddleware({
      // staticSubprovider
      eth_syncing: false,
      web3_clientVersion: `TronMask/v${version}`,
    }),
    // @TRON
    createScaffoldMiddleware({
      tron_signTransaction: createAsyncMiddleware(async (req, res) => {
        res.result = await processSignTronTransaction(req.params[0], req)
      }),
    }),
    createWalletSubprovider({
      getAccounts,
      processTransaction,
      processEthSignMessage,
      processTypedMessage,
      processTypedMessageV3,
      processTypedMessageV4,
      processPersonalMessage,
      processDecryptMessage,
      processEncryptionPublicKey,
    }),
    createPendingNonceMiddleware({ getPendingNonce }),
    createPendingTxMiddleware({ getPendingTransactionByHash }),
  ])
  return tronmaskMiddleware
}
