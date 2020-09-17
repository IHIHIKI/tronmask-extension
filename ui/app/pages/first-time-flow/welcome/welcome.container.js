import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Web3 from 'web3'
import { closeWelcomeScreen } from '../../../store/actions'
import Welcome from './welcome.component'

function getTronmaskV1Keystore () {
  /* eslint-disable */
  const vuex = localStorage.getItem('vuex')
  if (!vuex) return null
  try {
    const keystoreHex = JSON.parse(vuex).wallet.keystore
    const keystore = JSON.parse(Buffer.from(keystoreHex, 'hex').toString('ascii'));
    return keystore
  } catch(err) {
    console.log(err)
    return null
  }
}


const mapStateToProps = ({ tronmask }) => {
  const { welcomeScreenSeen, participateInMetaMetrics } = tronmask

  // Detect users of previous extension (hisman's version)
  const tronmaskV1Keystore = getTronmaskV1Keystore()

  return {
    welcomeScreenSeen,
    participateInMetaMetrics,
    tronmaskV1Keystore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Welcome)
