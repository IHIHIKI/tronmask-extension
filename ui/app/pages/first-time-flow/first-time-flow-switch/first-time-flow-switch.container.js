import { connect } from 'react-redux'
import FirstTimeFlowSwitch from './first-time-flow-switch.component'

const mapStateToProps = ({ tronmask }) => {
  const {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    participateInMetaMetrics: optInMetaMetrics,
  } = tronmask

  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    optInMetaMetrics,
  }
}

export default connect(mapStateToProps)(FirstTimeFlowSwitch)
