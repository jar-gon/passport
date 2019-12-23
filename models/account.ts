export interface Account {
  id: string
  username: string
  mobile: string
  email: string
}

export interface LoginInfo {
  token: string
  isvId: string
  reset: boolean
}
