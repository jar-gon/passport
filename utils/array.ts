/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dictionary } from '@billypon/ts-types'

export function zipObject(keys: string[], values: any[]): Dictionary {
  return keys.reduce((result: Dictionary, key: string, index: number) => {
    result[key] = values[index]
    return result
  }, { })
}
