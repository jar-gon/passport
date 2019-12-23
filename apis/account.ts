/* eslint-disable @typescript-eslint/no-explicit-any */

import { Observable } from 'rxjs'

import Api from './common'
import { AccountApiClass } from '~/utils/api'
import { Account, LoginInfo } from '~/models/account'

@AccountApiClass
class AccountApi extends Api {
  getInfo(): Observable<Account> {
    return this.axios.get('/account/info') as any
  }

  login(username: string, password: string, isv: string, sessionId: string, scene: string, sig: string, token: string): Observable<LoginInfo> {
    const params = { username, password, isv, type: 'reseller', sessionId, scene, sig, token }
    return this.axios.get('/account/token', { params }) as any
  }

  logout(token: string): Observable<void> {
    return this.axios.delete(`/account/token/${ token }`) as any
  }

  updatePassword(accountId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.axios.patch(`/account/${ accountId }/password`, { oldPassword, newPassword }) as any
  }
}

export default AccountApi
