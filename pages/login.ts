import router from 'next/router'
import { connect } from 'react-redux/es'
import qs from 'qs'
import matcher from 'matcher'
import { Component } from '@billypon/react-utils/react'
import FormComponent, { FormComponentRef, FormState } from '@billypon/react-utils/form-component'
import { browser, getQueryParams } from '@billypon/react-utils/common'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage, checkLogin } from '~/utils/storage'
import { NoCaptcha } from '~/utils/captcha'
import { publicRuntimeConfig } from '~/utils/config'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'

import SiteLayout from '~/components/layout'
import template from './login.pug'

interface LoginState {
  states: Dictionary<FormState>
  errorMessage: string
}

@connect(mapState)
class Login extends Component<ConnectedProps, LoginState> {
  accountApi: AccountApi
  form = new FormComponentRef()
  captcha: NoCaptcha;

  getInitialState() {
    if (!browser) {
      return super.getInitialState()
    }
    const states: Dictionary<FormState> = {
      username: {
        label: '用户名',
        rules: [
          { required: true, message: '请输入用户名' },
        ],
      },
      password: {
        label: '密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
        ],
      },
    }
    return { states }
  }

  componentDidMount() {
    if (checkLogin()) {
      this.redirectFromLogin()
      return
    }
    this.accountApi = new AccountApi(this.props.isvName)
    this.captcha = new NoCaptcha
  }

  @autobind()
  onSubmit(values) {
    if (!this.captcha.data) {
      this.setState({ errorMessage: '请滑动验证码' })
      return
    }
    const { csessionid, scene, sig } = this.captcha.data
    this.form.setLoading(true).subscribe(() => this.setState({ errorMessage: '' }))
    this.accountApi.login(
      values.username,
      values.password,
      this.props.isvName,
      csessionid,
      scene,
      sig,
      this.captcha.data.token,
    ).subscribe(
      ({ token, isvId }) => {
        storage.token = token
        storage.isv = isvId
        this.redirectFromLogin()
      },
      ({ retMsg }: ApiResult) => {
        this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
        this.captcha.reload()
      },
    )
  }

  redirectFromLogin(): void {
    let { redirect } = getQueryParams()
    if (/(https?:)?\/\//.test(redirect)) {
      const { hostname } = window.location
      const { domain } = publicRuntimeConfig
      if (domain) {
        if (matcher([ hostname ], domain.split(',')).length) {
          const params = {
            token: storage.token,
            isv: storage.isv,
          }
          window.location.replace(`${ redirect }${ redirect.includes('?') ? '&' : '?' }${ qs.stringify(params) }`)
          return
        }
      }
      redirect = ''
    } else if (redirect && redirect[0] !== '/') {
      redirect = ''
    }
    router.replace(redirect || '/')
  }

  render() {
    return template.call(this, { ...this, SiteLayout, FormComponent })
  }
}

export default Login
