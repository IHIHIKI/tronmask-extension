import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import ConfirmSignTronTransaction from './confirm-sign-tron-transaction.component'

const mapStateToProps = (state) => {
  const { confirmTransaction: { txData = {} } } = state

  return {
    txData,
    txParams: txData.txParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmSignTronTransaction)
