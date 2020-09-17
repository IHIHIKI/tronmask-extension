import * as actionConstants from '../../store/actionConstants'
import { ALERT_TYPES } from '../../../../app/scripts/controllers/alert'

export default function reduceTronmask (state = {}, action) {
  const tronmaskState = {
    isInitialized: false,
    isUnlocked: false,
    isAccountMenuOpen: false,
    rpcTarget: 'https://rawtestrpc.tronmask.org/',
    identities: {},
    unapprovedTxs: {},
    frequentRpcList: [],
    addressBook: [],
    contractExchangeRates: {},
    tokens: [],
    pendingTokens: {},
    customNonceValue: '',
    send: {
      gasLimit: null,
      gasPrice: null,
      gasTotal: null,
      tokenBalance: '0x0',
      from: '',
      to: '',
      amount: '0',
      memo: '',
      errors: {},
      maxModeOn: false,
      editingTransactionId: null,
      toNickname: '',
      ensResolution: null,
      ensResolutionError: '',
    },
    useBlockie: false,
    featureFlags: {},
    welcomeScreenSeen: false,
    currentLocale: '',
    preferences: {
      autoLockTimeLimit: undefined,
      showFiatInTestnets: false,
      useNativeCurrencyAsPrimaryCurrency: true,
    },
    firstTimeFlowType: null,
    completedOnboarding: false,
    knownMethodData: {},
    participateInMetaMetrics: null,
    metaMetricsSendCount: 0,
    nextNonce: null,
    ...state,
  }

  switch (action.type) {

    case actionConstants.UPDATE_TRONMASK_STATE:
      return { ...tronmaskState, ...action.value }

    case actionConstants.LOCK_TRONMASK:
      return {
        ...tronmaskState,
        isUnlocked: false,
      }

    case actionConstants.SET_RPC_TARGET:
      return {
        ...tronmaskState,
        provider: {
          type: 'rpc',
          rpcTarget: action.value,
        },
      }

    case actionConstants.SET_PROVIDER_TYPE:
      return {
        ...tronmaskState,
        provider: {
          type: action.value,
        },
      }

    case actionConstants.SHOW_ACCOUNT_DETAIL:
      return {
        ...tronmaskState,
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      }

    case actionConstants.SET_ACCOUNT_LABEL: {
      const { account } = action.value
      const name = action.value.label
      const id = {}
      id[account] = { ...tronmaskState.identities[account], name }
      const identities = { ...tronmaskState.identities, ...id }
      return Object.assign(tronmaskState, { identities })
    }

    case actionConstants.SET_CURRENT_FIAT:
      return Object.assign(tronmaskState, {
        currentCurrency: action.value.currentCurrency,
        conversionRate: action.value.conversionRate,
        conversionDate: action.value.conversionDate,
      })

    case actionConstants.UPDATE_TOKENS:
      return {
        ...tronmaskState,
        tokens: action.newTokens,
      }

    // tronmask.send
    case actionConstants.UPDATE_GAS_LIMIT:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          gasLimit: action.value,
        },
      }
    case actionConstants.UPDATE_CUSTOM_NONCE:
      return {
        ...tronmaskState,
        customNonceValue: action.value,
      }
    case actionConstants.UPDATE_GAS_PRICE:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          gasPrice: action.value,
        },
      }

    case actionConstants.TOGGLE_ACCOUNT_MENU:
      return {
        ...tronmaskState,
        isAccountMenuOpen: !tronmaskState.isAccountMenuOpen,
      }

    case actionConstants.UPDATE_GAS_TOTAL:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          gasTotal: action.value,
        },
      }

    case actionConstants.UPDATE_SEND_TOKEN_BALANCE:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          tokenBalance: action.value,
        },
      }

    case actionConstants.UPDATE_SEND_HEX_DATA:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          data: action.value,
        },
      }

    case actionConstants.UPDATE_SEND_TO:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          to: action.value.to,
          toNickname: action.value.nickname,
        },
      }

    case actionConstants.UPDATE_SEND_AMOUNT:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          amount: action.value,
        },
      }

    case actionConstants.UPDATE_MAX_MODE:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          maxModeOn: action.value,
        },
      }

    case actionConstants.UPDATE_SEND:
      return Object.assign(tronmaskState, {
        send: {
          ...tronmaskState.send,
          ...action.value,
        },
      })

    case actionConstants.UPDATE_SEND_TOKEN: {
      const newSend = {
        ...tronmaskState.send,
        token: action.value,
      }
      // erase token-related state when switching back to native currency
      if (newSend.editingTransactionId && !newSend.token) {
        const unapprovedTx = newSend?.unapprovedTxs?.[newSend.editingTransactionId] || {}
        const txParams = unapprovedTx.txParams || {}
        Object.assign(newSend, {
          tokenBalance: null,
          balance: '0',
          from: unapprovedTx.from || '',
          unapprovedTxs: {
            ...newSend.unapprovedTxs,
            [newSend.editingTransactionId]: {
              ...unapprovedTx,
              txParams: {
                ...txParams,
                data: '',
              },
            },
          },
        })
      }
      return Object.assign(tronmaskState, {
        send: newSend,
      })
    }

    case actionConstants.UPDATE_SEND_ENS_RESOLUTION:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          ensResolution: action.payload,
          ensResolutionError: '',
        },
      }

    case actionConstants.UPDATE_SEND_ENS_RESOLUTION_ERROR:
      return {
        ...tronmaskState,
        send: {
          ...tronmaskState.send,
          ensResolution: null,
          ensResolutionError: action.payload,
        },
      }

    case actionConstants.CLEAR_SEND:
      return {
        ...tronmaskState,
        send: {
          gasLimit: null,
          gasPrice: null,
          gasTotal: null,
          tokenBalance: null,
          from: '',
          to: '',
          amount: '0x0',
          memo: '',
          errors: {},
          maxModeOn: false,
          editingTransactionId: null,
          toNickname: '',
        },
      }

    case actionConstants.UPDATE_TRANSACTION_PARAMS: {
      const { id: txId, value } = action
      let { currentNetworkTxList } = tronmaskState
      currentNetworkTxList = currentNetworkTxList.map((tx) => {
        if (tx.id === txId) {
          const newTx = { ...tx }
          newTx.txParams = value
          return newTx
        }
        return tx
      })

      return {
        ...tronmaskState,
        currentNetworkTxList,
      }
    }

    case actionConstants.SET_PARTICIPATE_IN_METAMETRICS:
      return {
        ...tronmaskState,
        participateInMetaMetrics: action.value,
      }

    case actionConstants.SET_METAMETRICS_SEND_COUNT:
      return {
        ...tronmaskState,
        metaMetricsSendCount: action.value,
      }

    case actionConstants.SET_USE_BLOCKIE:
      return {
        ...tronmaskState,
        useBlockie: action.value,
      }

    case actionConstants.UPDATE_FEATURE_FLAGS:
      return {
        ...tronmaskState,
        featureFlags: action.value,
      }

    case actionConstants.CLOSE_WELCOME_SCREEN:
      return {
        ...tronmaskState,
        welcomeScreenSeen: true,
      }

    case actionConstants.SET_CURRENT_LOCALE:
      return {
        ...tronmaskState,
        currentLocale: action.value.locale,
      }

    case actionConstants.SET_PENDING_TOKENS:
      return {
        ...tronmaskState,
        pendingTokens: { ...action.payload },
      }

    case actionConstants.CLEAR_PENDING_TOKENS: {
      return {
        ...tronmaskState,
        pendingTokens: {},
      }
    }

    case actionConstants.UPDATE_PREFERENCES: {
      return {
        ...tronmaskState,
        preferences: {
          ...tronmaskState.preferences,
          ...action.payload,
        },
      }
    }

    case actionConstants.COMPLETE_ONBOARDING: {
      return {
        ...tronmaskState,
        completedOnboarding: true,
      }
    }

    case actionConstants.SET_FIRST_TIME_FLOW_TYPE: {
      return {
        ...tronmaskState,
        firstTimeFlowType: action.value,
      }
    }

    case actionConstants.SET_NEXT_NONCE: {
      return {
        ...tronmaskState,
        nextNonce: action.value,
      }
    }

    default:
      return tronmaskState
  }
}

export const getCurrentLocale = (state) => state.tronmask.currentLocale

export const getAlertEnabledness = (state) => state.tronmask.alertEnabledness

export const getUnconnectedAccountAlertEnabledness = (state) => getAlertEnabledness(state)[ALERT_TYPES.unconnectedAccount]

export const getUnconnectedAccountAlertShown = (state) => state.tronmask.unconnectedAccountAlertShownOrigins

export const getTokens = (state) => state.tronmask.tokens
