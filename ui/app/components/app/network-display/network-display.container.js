import { connect } from 'react-redux'
import NetworkDisplay from './network-display.component'

const mapStateToProps = ({ tronmask: { network, provider } }) => {
  return {
    network,
    provider,
  }
}

export default connect(mapStateToProps)(NetworkDisplay)
