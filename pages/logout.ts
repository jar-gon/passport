import router from 'next/router'
import { connect } from 'react-redux/es'
import { Component } from '@billypon/react-utils/react'
import { getQueryParams } from '@billypon/react-utils/common'

import { mapState, ConnectedProps } from '~/utils/redux'
import { storage } from '~/utils/storage'

import AccountApi from '~/apis/account'

@connect(mapState)
class Logout extends Component<ConnectedProps> {
  componentDidMount() {
    if (storage.token) {
      const accountApi = new AccountApi(this.props.isvName)
      accountApi.logout(storage.token).subscribe(() => {
        storage.token = null
        storage.isv = null
        this.redirectFromLogout()
      })
    } else {
      this.redirectFromLogout()
    }
  }

  redirectFromLogout(): void {
    let { redirect } = getQueryParams()
    if (!redirect || redirect[0] !== '/') {
      redirect = '/login'
    }
    router.replace(redirect)
  }

  render() {
    return null
  }
}

export default Logout
