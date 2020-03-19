import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billypon/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState } from '@billypon/react-utils/simple-form'
import { browser } from '@billypon/react-utils/common'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { NoCaptcha } from '~/utils/captcha'
import { getRedirectQuery } from '~/utils/common'

import AccountApi from '~/apis/account'
import { ApiResult } from '~/models/api'

import SiteLayout from '~/components/layout'
import template from './forget-password.pug'

interface ForgetPasswordState {
  states: Dictionary<FormState>
  errorMessage: string
  redirectQuery: string
}

@connect(mapState)
class ForgetPassword extends Component<ConnectedProps, ForgetPasswordState> {
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
    }
    return { states, redirectQuery }
  }

  componentDidMount() {
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
    this.accountApi.getResetToken(
      this.props.isvName,
      values.username,
      csessionid,
      scene,
      sig,
      this.captcha.data.token,
    ).subscribe(
      ({ token }) => router.push(`/reset-password?token=${ token }`),
      ({ retMsg }: ApiResult) => {
        this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
        this.captcha.reload()
      },
    )
  }

  render() {
    return template.call(this, { ...this, SiteLayout, SimpleForm })
  }
}

export default ForgetPassword
