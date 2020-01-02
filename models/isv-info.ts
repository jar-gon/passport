export interface IsvInfo {
  isv_desc: string
  keyword: string
  description: string
  reseller_favicon: string
  reseller_logo: string
  reseller_avatar: string
  mis_favicon: string
  mis_logo: string
  mis_avatar: string
  domain_names: {
    type: string
    prefix: string
    full_prefix: string
  }[]
}
