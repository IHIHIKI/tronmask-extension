import abi from 'human-standard-token-abi'
import { calcGasTotal } from '../pages/send/send.utils'
import {
  accountsWithSendEtherInfoSelector,
  getAddressBook,
  getSelectedAccount,
  getTargetAccount,
  getAveragePriceEstimateInHexSUN,
} from '.'

export function getBlockGasLimit (state) {
  return state.tronmask.currentBlockGasLimit
}

export function getConversionRate (state) {
  return state.tronmask.conversionRate
}

export function getNativeCurrency (state) {
  return state.tronmask.nativeCurrency
}

export function getCurrentNetwork (state) {
  return state.tronmask.network
}

export function getGasLimit (state) {
  return state.tronmask.send.gasLimit || '0'
}

export function getGasPrice (state) {
  return state.tronmask.send.gasPrice || getAveragePriceEstimateInHexSUN(state)
}

export function getGasTotal (state) {
  return calcGasTotal(getGasLimit(state), getGasPrice(state))
}

export function getPrimaryCurrency (state) {
  const sendToken = getSendToken(state)
  return sendToken?.symbol
}

export function getSendToken (state) {
  return state.tronmask.send.token
}

export function getSendTokenAddress (state) {
  return getSendToken(state)?.address
}

export function getSendTokenContract (state) {
  const sendTokenAddress = getSendTokenAddress(state)
  return sendTokenAddress
    ? global.eth.contract(abi).at(sendTokenAddress)
    : null
}

export function getSendAmount (state) {
  return state.tronmask.send.amount
}

export function getSendHexData (state) {
  return state.tronmask.send.data
}

export function getSendHexDataFeatureFlagState (state) {
  return state.tronmask.featureFlags.sendHexData
}

export function getSendEditingTransactionId (state) {
  return state.tronmask.send.editingTransactionId
}

export function getSendErrors (state) {
  return state.send.errors
}

export function sendAmountIsInError (state) {
  return Boolean(state.send.errors.amount)
}

export function getSendFrom (state) {
  return state.tronmask.send.from
}

export function getSendFromBalance (state) {
  const fromAccount = getSendFromObject(state)
  return fromAccount.balance
}

export function getSendFromObject (state) {
  const fromAddress = getSendFrom(state)
  return fromAddress
    ? getTargetAccount(state, fromAddress)
    : getSelectedAccount(state)
}

export function getSendMaxModeState (state) {
  return state.tronmask.send.maxModeOn
}

export function getSendTo (state) {
  return state.tronmask.send.to
}

export function getSendToNickname (state) {
  return state.tronmask.send.toNickname
}

export function getSendToAccounts (state) {
  const fromAccounts = accountsWithSendEtherInfoSelector(state)
  const addressBookAccounts = getAddressBook(state)
  return [...fromAccounts, ...addressBookAccounts]
}
export function getTokenBalance (state) {
  return state.tronmask.send.tokenBalance
}

export function getSendEnsResolution (state) {
  return state.tronmask.send.ensResolution
}

export function getSendEnsResolutionError (state) {
  return state.tronmask.send.ensResolutionError
}

export function getUnapprovedTxs (state) {
  return state.tronmask.unapprovedTxs
}

export function getQrCodeData (state) {
  return state.appState.qrCodeData
}

export function getGasLoadingError (state) {
  return state.send.errors.gasLoading
}

export function gasFeeIsInError (state) {
  return Boolean(state.send.errors.gasFee)
}

export function getGasButtonGroupShown (state) {
  return state.send.gasButtonGroupShown
}

export function getTitleKey (state) {
  const isEditing = Boolean(getSendEditingTransactionId(state))
  const isToken = Boolean(getSendToken(state))

  if (!getSendTo(state)) {
    return 'addRecipient'
  }

  if (isEditing) {
    return 'edit'
  } else if (isToken) {
    return 'sendTokens'
  }
  return 'sendETH'
}

export function isSendFormInError (state) {
  return Object.values(getSendErrors(state)).some((n) => n)
}
