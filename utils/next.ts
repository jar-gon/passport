import { withAuthentication as originWithAuthentication } from '@billypon/react-utils/next'

import { checkLogin } from './storage'

export const withAuthentication = originWithAuthentication(checkLogin)
