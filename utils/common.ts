import { browser, getQueryParams } from '@billypon/react-utils/common'

export function getRedirectQuery(): string {
  if (!browser) {
    return ''
  }
  const { redirect } = getQueryParams()
  return redirect ? `?redirect=${ encodeURIComponent(redirect) }` : ''
}

export function combineFunctions(...fns: Function[]) {
  return (value: unknown): void => {
    fns.forEach(fn => fn(value))
  }
}
