import { strict as assert } from 'assert'
import migration47 from '../../../app/scripts/migrations/047'

describe('migration #47', function () {
  it('should update the version metadata', async function () {
    const oldStorage = {
      'meta': {
        'version': 46,
      },
      'data': {},
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(newStorage.meta, {
      'version': 47,
    })
  })

  it('should stringify transactions tronmaskNetworkId values', async function () {
    const oldStorage = {
      meta: {},
      data: {
        TransactionController: {
          transactions: [
            { foo: 'bar', tronmaskNetworkId: 2 },
            { foo: 'bar' },
            { foo: 'bar', tronmaskNetworkId: 0 },
            { foo: 'bar', tronmaskNetworkId: 42 },
          ],
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(newStorage.data, {
      TransactionController: {
        transactions: [
          { foo: 'bar', tronmaskNetworkId: '2' },
          { foo: 'bar' },
          { foo: 'bar', tronmaskNetworkId: '0' },
          { foo: 'bar', tronmaskNetworkId: '42' },
        ],
      },
      foo: 'bar',
    })
  })

  it('should do nothing if transactions tronmaskNetworkId values are already strings', async function () {
    const oldStorage = {
      meta: {},
      data: {
        TransactionController: {
          transactions: [
            { foo: 'bar', tronmaskNetworkId: '2' },
            { foo: 'bar' },
            { foo: 'bar', tronmaskNetworkId: '0' },
            { foo: 'bar', tronmaskNetworkId: '42' },
          ],
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(oldStorage.data, newStorage.data)
  })

  it('should do nothing if transactions state does not exist', async function () {
    const oldStorage = {
      meta: {},
      data: {
        TransactionController: {
          bar: 'baz',
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(oldStorage.data, newStorage.data)
  })

  it('should do nothing if transactions state is empty', async function () {
    const oldStorage = {
      meta: {},
      data: {
        TransactionController: {
          transactions: [],
          bar: 'baz',
        },
        foo: 'bar',
      },
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(oldStorage.data, newStorage.data)
  })

  it('should do nothing if state is empty', async function () {
    const oldStorage = {
      meta: {},
      data: {},
    }

    const newStorage = await migration47.migrate(oldStorage)
    assert.deepEqual(oldStorage.data, newStorage.data)
  })
})
