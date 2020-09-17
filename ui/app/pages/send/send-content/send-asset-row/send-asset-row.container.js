import { connect } from 'react-redux'
import { getTronMaskAccounts, getSendTokenAddress } from '../../../../selectors'
import { updateSendToken } from '../../../../store/actions'
import SendAssetRow from './send-asset-row.component'

function mapStateToProps (state) {
  return {
    tokens: state.tronmask.tokens,
    selectedAddress: state.tronmask.selectedAddress,
    sendTokenAddress: getSendTokenAddress(state),
    accounts: getTronMaskAccounts(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSendToken: (token) => dispatch(updateSendToken(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendAssetRow)
