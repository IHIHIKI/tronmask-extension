import assert from 'assert'
import { getTronscanNetworkPrefix } from '../../../ui/lib/tronscan-prefix-for-network'

describe('Tronscan Network Prefix', function () {

  it('returns empty string as default value', function () {
    assert.equal(getTronscanNetworkPrefix(), '')
  })

  it('returns empty string as a prefix for networkId of 1', function () {
    assert.equal(getTronscanNetworkPrefix('1'), '')
  })

  it('returns ropsten as prefix for networkId of 3', function () {
    assert.equal(getTronscanNetworkPrefix('3'), 'ropsten.')
  })

  it('returns rinkeby as prefix for networkId of 4', function () {
    assert.equal(getTronscanNetworkPrefix('4'), 'rinkeby.')
  })

  it('returs kovan as prefix for networkId of 42', function () {
    assert.equal(getTronscanNetworkPrefix('42'), 'kovan.')
  })

  it('returs goerli as prefix for networkId of 5', function () {
    assert.equal(getTronscanNetworkPrefix('5'), 'goerli.')
  })

})
