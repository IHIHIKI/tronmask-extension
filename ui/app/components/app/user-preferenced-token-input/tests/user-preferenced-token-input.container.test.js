import assert from 'assert'
import proxyquire from 'proxyquire'

let mapStateToProps

proxyquire('../user-preferenced-token-input.container.js', {
  'react-redux': {
    connect: (ms) => {
      mapStateToProps = ms
      return () => ({})
    },
  },
})

describe('UserPreferencedTokenInput container', function () {
  describe('mapStateToProps()', function () {
    it('should return the correct props', function () {
      const mockState = {
        tronmask: {
          preferences: {
            useNativeCurrencyAsPrimaryCurrency: true,
          },
        },
      }

      assert.deepEqual(mapStateToProps(mockState), {
        useNativeCurrencyAsPrimaryCurrency: true,
      })
    })
  })
})
