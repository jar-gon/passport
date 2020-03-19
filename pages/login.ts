import router from 'next/router'
import { connect } from 'react-redux/es'
import qs from 'qs'
import matcher from 'matcher'
import { Component } from '@billypon/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState } from '@billypon/react-utils/simple-form'
import { browser, getQueryParams, buildUrl } from '@billypon/react-utils/common'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage, checkLogin, setTempLogin } from '~/utils/storage'
import { NoCaptcha } from '~/utils/captcha'
import { getRedirectQuery } from '~/utils/common'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'

import SiteLayout from '~/components/layout'
import template from './login.pug'

interface LoginState {
  states: Dictionary<FormState>
  errorMessage: string
  redirectQuery: string
}

@connect(mapState)
class Login extends Component<ConnectedProps, LoginState> {
  accountApi: AccountApi
  form = new SimpleFormRef()
  captcha: NoCaptcha;

  getInitialState() {
    const redirectQuery = getRedirectQuery()
    if (!browser) {
      return { redirectQuery }
    }
    const states: Dictionary<FormState> = {
      username: {
        label: '',
        placeholder: '用户名',
        rules: [
          { required: true, message: '请输入用户名' },
        ],
      },
      password: {
        label: '',
        placeholder: '密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
        ],
      },
    }
    return { states, redirectQuery }
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
      ({ token, isvId, reset }) => {
        if (reset) {
          setTempLogin(token, isvId)
          this.redirectToPassword()
          return
        }
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
    const { isvInfo } = this.props
    let { redirect } = getQueryParams()
    if (/(https?:)?\/\//.test(redirect)) {
      const { hostname } = window.location
      if (isvInfo.domain) {
        if (matcher([ hostname ], isvInfo.domain.split(',')).length) {
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

  redirectToPassword(): void {
    const { redirect } = getQueryParams()
    const url = buildUrl({
      path: '/update-password',
      query: redirect && { redirect },
    })
    router.push(url)
  }

  render() {
    return template.call(this, { ...this, SiteLayout, SimpleForm })
  }
}

export default Login
