import router from 'next/router'
import { connect } from 'react-redux/es'
import Form, { FormComponentProps } from 'antd/es/form'
import qs from 'qs'
import matcher from 'matcher'
import { FormComponent, FormComponentState } from '@billypon/react-utils/form'
import { getQueryParams } from '@billypon/react-utils/common'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage, checkLogin } from '~/utils/storage'
import { NoCaptcha } from '~/utils/captcha'
import { publicRuntimeConfig } from '~/utils/config'

import AccountApi from '~/apis/account'

import SiteLayout from '~/components/layout'
import template from './login.pug'

interface LoginState {
  errorMessage: string
}

@connect(mapState)
@Form.create()
class Login extends FormComponent<ConnectedProps & FormComponentProps, LoginState & FormComponentState> {
  accountApi: AccountApi
  captcha: NoCaptcha;

  componentDidMount() {
    if (checkLogin()) {
      this.redirectFromLogin()
      return
    }
    super.componentDidMount()
    this.accountApi = new AccountApi(this.props.isvName)
    this.captcha = new NoCaptcha
  }

  getFormFields() {
    return {
      username: {
        rules: [
          { required: true, message: '请输入用户名' },
        ],
      },
      password: {
        rules: [
          { required: true, message: '请输入密码' },
        ],
      },
    }
  }

  formSubmit(values) {
    if (!this.captcha.data) {
      this.setState({ errorMessage: '请滑动验证码' })
      return
    }
    const { csessionid, scene, sig } = this.captcha.data
    this.setState({ errorMessage: '', loading: true })
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
      ({ response: { data } }) => {
        this.setState({ errorMessage: data.retMsg, loading: false })
        this.captcha.reload()
      },
    )
  }

  redirectFromLogin(): void {
    let { redirect } = getQueryParams()
    if (/(https?:)?\/\//.test(redirect)) {
      const { hostname } = window.location
      const domain = publicRuntimeConfig.PUBLIC_DOMAIN
      if (domain) {
        if (matcher([ hostname ], domain.split(',')).length) {
          const params = qs.stringify({
            token: storage.token,
            isv: storage.isv,
          })
          window.location.replace(`${ redirect }${ redirect.includes('?') ? '&' : '?' }${ params }`)
          return
        }
      }
      redirect = ''
    } else if (redirect[0] !== '/') {
      redirect = ''
    }
    router.replace(redirect || '/')
  }

  render() {
    return template.call(this, { ...this, SiteLayout })
  }
}

export default Login
