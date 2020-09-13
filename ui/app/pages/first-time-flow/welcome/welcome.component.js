import EventEmitter from 'events'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Mascot from '../../../components/ui/mascot'
import Button from '../../../components/ui/button'
import TextField from '../../../components/ui/text-field'
import { decryptKeyStore } from '@tronmask/v1-keystore'

import { INITIALIZE_CREATE_PASSWORD_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '../../../helpers/constants/routes'

export default class Welcome extends Component {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
    tronmaskV1Keystore: PropTypes.object
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      unlockPassword: '',
      unlockPasswordError: '',
      unlocked: false,
    }

    this.animationEventEmitter = new EventEmitter()
  }

  componentDidMount () {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props

    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE)
    }
  }

  handleContinue = (e) => {
    e.preventDefault()
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE)
  }

  setUnlockPassword = (password) => {
    this.setState({
      unlockPassword: password,
    })
  }

  downloadPrivateKey = (privateKey) => {
    const element = document.createElement('a')
    /* eslint-disable no-undef */
    // todo: add usage instructions to file
    const txt = [
      'Your TronMask v1 private key is:',
      '\n\n',
      privateKey,
      '\n\n',
      'To import it in the new version of TronMask, copy and paste it in the "Import Account" section ("Private Key" type).',
      '\n\n',
      'After the import, we recommend you move any funds belonging to the imported address to a regular wallet address.',
      '\n\n',
      'If you decide to keep using that private key, remember to securely delete this file from your computer.',
      '\n\n',
      'Please contact support@tronmask.org for assistance.',
    ].join('')
    const file = new Blob([txt], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'tronmask-v1-privatekey.txt'
    document.body.appendChild(element)
    element.click()
    // TODO: remove element?
  }

  unlock = (e) => {
    e.preventDefault()
    const keystore = this.props.tronmaskV1Keystore
    const password = this.state.unlockPassword
    const ks = decryptKeyStore(password, keystore)
    if (!ks) {
      this.setState({ unlockPassword: password, unlockPasswordError: 'Incorrect password.' })
      return
    }
    this.downloadPrivateKey(ks.privateKey)
    this.setState({ privateKey: ks.privateKey })
  }

  renderForV1User () {
    const { t } = this.context
    const keystore = this.props.tronmaskV1Keystore
    const { address } = keystore

    if (this.state.privateKey) {
      return (
        <div className="welcome-page__wrapper">
          <div className="welcome-page">
            <Mascot
              width="125"
              height="125"
            />
            <div className="welcome-page__description">
              <p>
                Your private key is:
              </p>
              <p>{this.state.privateKey}</p>
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                IMPORTANT: A text file containing your private key was
                downloaded to your computer. You will now create a new wallet.
                Once the new wallet is created, you will be able to import your
                old private key using the &quot;Import Account&quot; function in the
                account selector dropdown.
              </p>
            </div>
            <div>
              <Button
                type="primary"
                className="first-time-flow__button"
                onClick={this.handleContinue}
              >
                { t('getStarted') }
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <Mascot
            animationEventEmitter={this.animationEventEmitter}
            width="125"
            height="125"
          />
          <div className="welcome-page__header">
            { t('welcomeV1User') }
          </div>
          <div className="welcome-page__description">
            <p>{ t('tronmaskV1UpgradeDescription') }</p>
          </div>
          <div className="welcome-page__unlock">
            <form onSubmit={this.unlock}>
              <TextField
                id="password"
                label={t('password')}
                type="password"
                className="first-time-flow__input"
                value={this.state.unlockPassword}
                onChange={(event) => this.setUnlockPassword(event.target.value)}
                error={this.state.unlockPasswordError}
                autoComplete="password"
                margin="normal"
                largeLabel
              />
              <Button type="primary" onClick={this.unlock}>Unlock wallet</Button>
            </form>
          </div>

          <div className="welcome-page__forgotPassword">
            <strong>Forgot password?</strong> Your wallet address is{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://tronscan.org/#/address/${address}`}
            >
              {address}
            </a>.{' '}

            Your private key is encrypted using your wallet password
            which means that if you really lost it, there is no way
            to recover the private key.{' '}
            <a href="#" onClick={this.handleContinue}>
                Click here if you wish to
                delete your old wallet and continue.
            </a>
          </div>
          {/*
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            { t('getStarted') }
          </Button>
          */}
        </div>
      </div>
    )
  }

  renderForNewUser () {
    const { t } = this.context

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <Mascot
            animationEventEmitter={this.animationEventEmitter}
            width="125"
            height="125"
          />
          <div className="welcome-page__header">
            { t('welcome') }
          </div>
          <div className="welcome-page__description">
            <div>{ t('metamaskDescription') }</div>
            <div>{ t('happyToSeeYou') }</div>
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            { t('getStarted') }
          </Button>
        </div>
      </div>
    )
  }

  render () {
    if (this.props.tronmaskV1Keystore) {
      return this.renderForV1User()
    }
    return this.renderForNewUser()
  }
}
