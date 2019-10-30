/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResult<T = any> {
  retCode: string
  retMsg: string
  data: T
}

export interface PageResult<T = any> {
  pageNumber: number
  pageSize: number
  TotalCount: number
  pageData: T[]
}
