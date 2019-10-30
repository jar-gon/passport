import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { ApiClass as OriginApiClass, ApiCall } from '@billypon/react-utils/api'
import { ObservablePipe } from '@billypon/rxjs-types'
import { Dictionary } from '@billypon/ts-types'

import { ApiResult, PageResult } from '~/models/api'
import { publicRuntimeConfig } from './config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseData(observable: Observable<ApiResult>): Observable<any> {
  return observable.pipe(map(({ data }) => data && JSON.parse(JSON.stringify(data))))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePageData(observable: Observable<PageResult<any>>): Observable<any[]> {
  return observable.pipe(map(({ pageData }) => pageData))
}

function getBaseUrl(port: number): string {
  return `${ publicRuntimeConfig.PUBLIC_API }:${ port }/api/v1`
}

function getPipes({ share = true, cache = true, raw = false }: Dictionary): ObservablePipe[] {
  const pipes: ObservablePipe[] = [ ]
  if (!raw) {
    pipes.push(parseData)
  }
  if (cache) {
    pipes.push(shareReplay(1))
    if (share) {
      pipes.reverse()
    }
  }
  return pipes
}

export function ApiClass(port: number) {
  return OriginApiClass({ port, getBaseUrl: () => getBaseUrl(port), getPipes })
}

export { ApiCall }

export const AccountApiClass = ApiClass(7000)

export const FinanceApiClass = ApiClass(4000)

export const TicketApiClass = ApiClass(5000)

export const ResourceApiClass = ApiClass(7000)
