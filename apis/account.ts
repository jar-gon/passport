/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { AccountApiClass } from '~/utils/api'
import { Account, LoginInfo } from '~/models/account'
import { IsvInfo } from '~/models/isv-info'

export interface CreateAccountData {
  username: string
  password: string
  mobile: string
  code: string
  accept: boolean
  isv: string
}

export interface ValidateCode {
  seconds: number
  status: boolean // false=重复发送
}

export interface ResetToken {
  token: string
}

export interface ResetTokenInfo {
  username: string
  mobile: string
}

@AccountApiClass
class AccountApi extends Api {
  createAccount(data: CreateAccountData): Observable<string> {
    return this.axios.post('/account', data) as any
  }

  getInfo(): Observable<Account> {
    return this.axios.get('/account/info') as any
  }

  getIsvInfo(): Observable<IsvInfo> {
    return this.axios.get('/isv-info') as any
  }

  getResetToken(isv: string, username: string, sessionId: string, scene: string, sig: string, token: string): Observable<ResetToken> {
    const params = { isv, username, type: 'reseller', sessionId, scene, sig, token }
    return this.axios.get('/account/reset/token', { params }) as any
  }

  getResetTokenInfo(token: string): Observable<ResetTokenInfo> {
    return this.axios.get(`/account/reset/password/${ token }`) as any
  }

  getResetValidateCode(token: string): Observable<ValidateCode> {
    return this.axios.get(`/account/reset/mobile-code/${ token }`) as any
  }

  getValidateCode(isv: string, mobile: string): Observable<ValidateCode> {
    const params = { isv, mobile }
    return this.axios.get('/account/validate-code', { params }) as any
  }

  login(username: string, password: string, isv: string, sessionId: string, scene: string, sig: string, token: string): Observable<LoginInfo> {
    const params = { username, password, isv, type: 'reseller', sessionId, scene, sig, token }
    return this.axios.get('/account/token', { params }) as any
  }

  logout(token: string): Observable<void> {
    return this.axios.delete(`/account/token/${ token }`) as any
  }

  resetPassword(token: string, password: string, code: string): Observable<void> {
    return this.axios.post<void>(`/account/reset/password/${ token }`, { password, code }) as any
  }

  updatePassword(accountId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.axios.patch(`/account/${ accountId }/password`, { oldPassword, newPassword }) as any
  }
}

export default AccountApi
