import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'
import createFetchMiddleware from 'eth-json-rpc-middleware/fetch'
import createBlockRefRewriteMiddleware from 'eth-json-rpc-middleware/block-ref-rewrite'
import createBlockTrackerInspectorMiddleware from 'eth-json-rpc-middleware/block-tracker-inspector'
import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import providerFromMiddleware from 'eth-json-rpc-middleware/providerFromMiddleware'
import BlockTracker from 'eth-block-tracker'
import { createJavaTronMiddleware } from '@opentron/java-tron-provider'

const inTest = process.env.IN_TEST === 'true'

const type2network = {
  'nile': 'nile',
  'mainnet': 'mainnet'
}

export default function createJavaTronClient (type) {
  const network = type2network[type];
  console.log({ network });
  console.log({ createJavaTronMiddleware });
  const fetchMiddleware = createJavaTronMiddleware({ network })

  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new BlockTracker({ provider: blockProvider, pollingInterval: 1000 })

  const networkMiddleware = mergeMiddleware([
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}
