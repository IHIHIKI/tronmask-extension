import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { lockTronmask } from '../../store/actions'
import Lock from './lock.component'

const mapStateToProps = (state) => {
  const { tronmask: { isUnlocked } } = state

  return {
    isUnlocked,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    lockTronmask: () => dispatch(lockTronmask()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Lock)
