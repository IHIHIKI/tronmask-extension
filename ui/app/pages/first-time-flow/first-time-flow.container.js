import { connect } from 'react-redux'
import { getFirstTimeFlowTypeRoute } from '../../selectors'
import Web3 from 'web3'
import {
  createNewVaultAndGetSeedPhrase,
  createNewVaultAndRestore,
  unlockAndGetSeedPhrase,
  verifySeedPhrase,
} from '../../store/actions'
import {
  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
} from '../../helpers/constants/routes'
import FirstTimeFlow from './first-time-flow.component'

function getTronmaskV1Keystore () {
  /* eslint-disable */
  if (!localStorage.getItem('vuex')) return false
  try {
    const keystoreHex = JSON.parse(vuex).wallet.keystore
    const keystore = Web3.utils.hexToAscii(`0x${keystoreHex}`)
    return keystore
  } catch(err) {
    return false
  }
}

const mapStateToProps = (state, ownProps) => {
  const { metamask: { completedOnboarding, isInitialized, isUnlocked, seedPhraseBackedUp } } = state
  const showingSeedPhraseBackupAfterOnboarding = Boolean(ownProps.location.pathname.match(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE))

  // Detect users of previous extension (hisman's version)
  const tronmaskV1Keystore = getTronmaskV1Keystore()

  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    nextRoute: getFirstTimeFlowTypeRoute(state),
    showingSeedPhraseBackupAfterOnboarding,
    seedPhraseBackedUp,
    tronmaskV1Keystore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewAccount: (password) => dispatch(createNewVaultAndGetSeedPhrase(password)),
    createNewAccountFromSeed: (password, seedPhrase) => {
      return dispatch(createNewVaultAndRestore(password, seedPhrase))
    },
    unlockAccount: (password) => dispatch(unlockAndGetSeedPhrase(password)),
    verifySeedPhrase: () => verifySeedPhrase(),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeFlow)
