import { browser } from '@billypon/react-utils/common'
import { Dictionary } from '@billypon/ts-types'

const localStorage = browser ? window.localStorage : { } as Dictionary

function getValue(key): string {
  return localStorage[key]
}

function setValue(key, value): void {
  switch (value) {
    case undefined:
    case null:
      delete localStorage[key]
      break
    default:
      localStorage[key] = value
      break
  }
}

class Storage {
  private _token: string = getValue('token')

  get token(): string {
    return this._token
  }

  set token(value: string) {
    setValue('token', value)
    this._token = value
  }

  private _isv: string = getValue('isv')

  get isv(): string {
    return this._isv
  }

  set isv(value: string) {
    setValue('isv', value)
    this._isv = value
  }
}

export const storage = new Storage

export function checkLogin(): boolean {
  return localStorage.token && localStorage.isv
}

export function setTempLogin(token: string, isvId: string) {
  sessionStorage.token = token
  sessionStorage.isv = isvId
}

export function checkTempLogin(): boolean {
  return sessionStorage.token && sessionStorage.isv
}
