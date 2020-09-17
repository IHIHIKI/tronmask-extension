import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import { ENVIRONMENT_TYPE_POPUP } from '../../../../app/scripts/lib/enums'
import { DEFAULT_ROUTE, RESTORE_VAULT_ROUTE } from '../../helpers/constants/routes'
import {
  tryUnlockTronmask,
  forgotPassword,
  markPasswordForgotten,
  forceUpdateTronmaskState,
  showModal,
} from '../../store/actions'
import UnlockPage from './unlock-page.component'

const mapStateToProps = (state) => {
  const { tronmask: { isUnlocked } } = state
  return {
    isUnlocked,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockTronmask: (password) => dispatch(tryUnlockTronmask(password)),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
    forceUpdateTronmaskState: () => forceUpdateTronmaskState(dispatch),
    showOptInModal: () => dispatch(showModal({ name: 'METAMETRICS_OPT_IN_MODAL' })),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  // eslint-disable-next-line no-shadow
  const { markPasswordForgotten, tryUnlockTronmask, ...restDispatchProps } = dispatchProps
  const { history, onSubmit: ownPropsSubmit, ...restOwnProps } = ownProps

  const onImport = async () => {
    await markPasswordForgotten()
    history.push(RESTORE_VAULT_ROUTE)

    if (getEnvironmentType() === ENVIRONMENT_TYPE_POPUP) {
      global.platform.openExtensionInBrowser(RESTORE_VAULT_ROUTE)
    }
  }

  const onSubmit = async (password) => {
    await tryUnlockTronmask(password)
    history.push(DEFAULT_ROUTE)
  }

  return {
    ...stateProps,
    ...restDispatchProps,
    ...restOwnProps,
    onImport,
    onRestore: onImport,
    onSubmit: ownPropsSubmit || onSubmit,
    history,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(UnlockPage)
