import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billypon/react-utils/react'
import SimpleForm, { SimpleFormRef, FormState, InputAddition, wrapItemTemplate } from '@billypon/react-utils/simple-form'
import { FragmentWrap } from '@billypon/react-utils/form'
import { equalWith } from '@billypon/react-utils/form/validators'
import { getQueryParams, buildUrl } from '@billypon/react-utils/common'
import Template from '@billypon/react-template'
import { Dictionary } from '@billypon/ts-types'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { mobile } from '~/utils/validators'
import { getRedirectQuery, combineFunctions } from '~/utils/common'

import AccountApi, { CreateAccountData } from '~/apis/account'
import { ApiResult } from '~/models/api'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import template from './register.pug'

interface RegisterState {
  states: Dictionary<FormState>
  sendTime: number
  errorMessage: string
  redirectQuery: string
}

@connect(mapState)
class Register extends Component<ConnectedProps, RegisterState> {
  accountApi: AccountApi
  form = new SimpleFormRef()
  sendInterval: NodeJS.Timeout

  usernameTpl: Template
  verifyCodeTpl: Template

  getInitialState() {
    return {
      redirectQuery: getRedirectQuery(),
    }
  }

  componentDidMount() {
    this.accountApi = new AccountApi(this.props.isvName)
    this.initFormStates()
  }

  componentWillUnmount() {
    clearInterval(this.sendInterval)
  }

  initFormStates(): void {
    const states: Dictionary<FormState> = {
      username: {
        label: '',
        placeholder: '设置用户名',
        rules: [
          { required: true, message: '请输入用户名' },
        ],
        render: {
          control: wrapItemTemplate(this.usernameTpl),
        },
      },
      password: {
        label: '',
        placeholder: '输入密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入密码' },
        ],
      },
      password2: {
        label: '',
        placeholder: '再次输入密码',
        subtype: 'password',
        rules: [
          { required: true, message: '请输入确认密码' },
          { validator: equalWith(() => this.form.getFieldValue('password')), message: '两次密码输入不一致' },
        ],
      },
      mobile: {
        label: '',
        placeholder: '移动电话 +86',
        rules: [
          { required: true, message: '请输入移动电话' },
          { pattern: mobile, message: '请输入正确的移动电话' },
        ],
      },
      verifyCode: {
        label: '',
        placeholder: '输入验证码',
        rules: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码必须为6位数字' },
        ],
        addition: {
          maxLength: 6,
        } as InputAddition,
        render: {
          control: wrapItemTemplate(this.verifyCodeTpl),
        },
      },
      // agreement: {
      //   label: '用户协议',
      //   type: 'checkbox',
      //   rules: [
      //     { required: true, message: '请先同意用户服务协议' },
      //   ],
      //   addition: {
      //     label: false,
      //   },
      // },
    }
    this.setState({ states })
  }

  @autobind()
  sendVerifyCode(): void {
    this.form.validateFields([ 'mobile' ], (err, value) => {
      if (err) {
        this.form.setFieldError('mobile', err)
        return
      }
      this.accountApi.getValidateCode(this.props.isvName, value.mobile).subscribe(({ seconds }) => {
        this.setState({ sendTime: seconds })
        this.sendInterval = setInterval(() => {
          let { sendTime } = this.state
          sendTime--
          this.setState({ sendTime })
          if (!sendTime) {
            clearInterval(this.sendInterval)
          }
        }, 1000)
      })
    })
  }

  @autobind()
  onSubmit(values) {
    const data: CreateAccountData = {
      username: values.username,
      password: values.password,
      mobile: values.mobile,
      code: values.verifyCode,
      accept: true,
      isv: this.props.isvName,
    }
    this.setState({ errorMessage: '' })
    this.form.setLoading(true)
    this.accountApi.createAccount(data).subscribe(
      () => this.redirectToLogin(),
      ({ retMsg }: ApiResult) => {
        this.form.setLoading(false).subscribe(() => this.setState({ errorMessage: retMsg }))
      },
    )
  }

  redirectToLogin(): void {
    const { redirect } = getQueryParams()
    const url = buildUrl({
      path: '/login',
      query: redirect && { redirect },
    })
    router.replace(url)
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, SimpleForm, Template, FragmentWrap, combineFunctions })
  }
}

export default Register
