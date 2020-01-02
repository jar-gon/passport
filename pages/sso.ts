/* eslint-disable @typescript-eslint/no-explicit-any */

import matcher from 'matcher'
import { browser } from '@billypon/react-utils/common'

import { store } from '~/utils/redux'
import { storage, checkLogin } from '~/utils/storage'

interface MessageEventData {
  action: string
  meta: string
  data?: any
  result?: any
}

function postMessage(target: WindowProxy, message: MessageEventData, origin: string): void {
  target.postMessage(message, origin)
}

function authenticate() {
  const { token, isv } = storage
  return !checkLogin() ? null : { token, isv }
}

function destroy(token: string) {
  if (!token || token === storage.token) {
    storage.token = null
    storage.isv = null
  }
}

export default function () {
  if (browser && window !== window.parent) {
    const { isvInfo } = store.default.getState()
    const domains = isvInfo.domain.split(',')
    window.addEventListener('message', (event: MessageEvent) => {
      const { origin } = event
      const source = event.source as WindowProxy
      const data = event.data as MessageEventData
      const { hostname } = new URL(origin)
      if (data && data.action && (!domains.length || !!matcher([ hostname ], domains).length)) {
        switch (data.action) {
          case 'authenticate':
            postMessage(source, { ...data, result: authenticate() }, origin)
            break
          case 'destroy':
            destroy(data.data as string)
            postMessage(source, data, origin)
            break
        }
      }
    })
    postMessage(window.parent, { action: 'ready', meta: 'ready' }, '*')
  }
  return null
}
