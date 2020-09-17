import assert from 'assert'
import freeze from 'deep-freeze-strict'
import reducers from '../../../ui/app/ducks'
import * as actionConstants from '../../../ui/app/store/actionConstants'

describe('config view actions', function () {
  const initialState = {
    tronmask: {
      rpcTarget: 'foo',
      frequentRpcList: [],
    },
    appState: {
      currentView: {
        name: 'accounts',
      },
    },
  }
  freeze(initialState)

  describe('SET_RPC_TARGET', function () {
    it('sets the state.tronmask.rpcTarget property of the state to the action.value', function () {
      const action = {
        type: actionConstants.SET_RPC_TARGET,
        value: 'foo',
      }

      const result = reducers(initialState, action)
      assert.equal(result.tronmask.provider.type, 'rpc')
      assert.equal(result.tronmask.provider.rpcTarget, 'foo')
    })
  })
})
