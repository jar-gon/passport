import * as config from '@billypon/react-utils/config'
import { Dictionary } from '@billypon/ts-types'

export const publicRuntimeConfig: Dictionary<string> = { }

export const serverRuntimeConfig: Dictionary<string> = { }

Object.entries(config.publicRuntimeConfig).forEach(([ key, value ]) => {
  publicRuntimeConfig[key.substr(7).toLowerCase()] = value as string
})

Object.entries(config.serverRuntimeConfig).forEach(([ key, value ]) => {
  serverRuntimeConfig[key.substr(7).toLowerCase()] = value as string
})
