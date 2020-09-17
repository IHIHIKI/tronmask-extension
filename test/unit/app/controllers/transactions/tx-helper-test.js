import { strict as assert } from 'assert'
import txHelper from '../../../../../ui/lib/tx-helper'

describe('txHelper', function () {
  it('always shows the oldest tx first', function () {
    const tronmaskNetworkId = '1'
    const txs = {
      a: { tronmaskNetworkId, time: 3 },
      b: { tronmaskNetworkId, time: 1 },
      c: { tronmaskNetworkId, time: 2 },
    }

    const sorted = txHelper(txs, null, null, tronmaskNetworkId)
    assert.equal(sorted[0].time, 1, 'oldest tx first')
    assert.equal(sorted[2].time, 3, 'newest tx last')
  })
})
