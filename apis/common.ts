import Axios from 'axios-observable'
import { useInterceptors } from '@billypon/react-utils/axios'
import { browser, replaceToLogout } from '@billypon/react-utils/common'
import { Dictionary } from '@billypon/ts-types'

import { storage, checkLogin, checkTempLogin } from '~/utils/storage'
import { publicRuntimeConfig } from '~/utils/config'
import { INVALID_TOKEN } from '~/utils/api-errors'

export default class {
  protected axios: Axios

  constructor(isvName: string) {
    let headers: Dictionary
    if (!browser || (!checkLogin() && !checkTempLogin())) {
      headers = {
        'Yunq-ISV-Name': isvName,
      }
    } else {
      headers = {
        'Yunq-Authenticate': storage.token || sessionStorage.token,
        'Yunq-ISV': storage.isv || sessionStorage.isv,
      }
    }
    this.axios = Axios.create({ baseURL: this.getBaseUrl(), headers })
    useInterceptors(this.axios)
    this.axios.interceptors.response.use(null, err => {
      const { retCode } = err || { } as Dictionary
      if (retCode === INVALID_TOKEN) {
        replaceToLogout()
      }
      return Promise.reject(err)
    })
  }

  getBaseUrl(): string {
    return publicRuntimeConfig.api
  }
}
