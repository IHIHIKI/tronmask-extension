import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ConfirmTransactionBase from '../confirm-transaction-base'

// TODO(tron): format more params...
const TRON_AMOUNT_KEYS = ['frozen_balance', 'amount']

export default class ConfirmSignTronTransaction extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    // txParams: PropTypes.object,
    txData: PropTypes.object,
  }

  renderParamRow ({ key, value }) {
    // TODO: format TRX amounts...
    // TODO: more formatting of known parameter types..
    let formattedValue = value
    if (TRON_AMOUNT_KEYS.includes(key)) {
      formattedValue = `${value / 1e6} TRX`
    }
    if (key === 'frozen_duration') {
      formattedValue = `${value} days`
    }
    return (
      <div className="confirm-detail-row">
        <div className="confirm-detail-row__label">
          {key}
        </div>
        <div className="confirm-detail-row__details">
          {formattedValue}
        </div>
      </div>
    )
  }

  renderDetailsComponent () {
    const { tronTx } = this.props.txData
    const ignoredKeys = ['owner_address']
    const contract = tronTx.raw_data.contract[0]
    // const contractType = contract.type
    const paramsObj = contract.parameter.value
    const params = Object.keys(paramsObj)
      .filter((key) => !ignoredKeys.includes(key))
      .map((key) => ({ key, value: paramsObj[key] }))
    return (
      <div className="confirm-page-container-content__details">
        {params.map((param) => this.renderParamRow(param))}
      </div>
    )
  }

  render () {
    const { tronTx } = this.props.txData
    const contract = tronTx.raw_data.contract[0]
    const title = contract.type.replace(/Contract$/u, '')

    return (
      <ConfirmTransactionBase
        hideData
        detailsComponent={this.renderDetailsComponent()}
        title={title}
      />
    )
  }
}
