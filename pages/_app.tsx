import NextApp from 'next/app'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import withRedux, { NextJSAppContext, AppProps } from 'next-redux-wrapper/es6'
import { ConfigProvider } from 'antd/es/index'
import { dev } from '@billypon/react-utils/common'
import '@billypon/react-utils/axios'

import { initializeStore } from '~/utils/redux'
import { serverRuntimeConfig } from '~/utils/config'

import AccountApi from '~/apis/account'
import { IsvInfo } from '~/models/isv-info'

import '~/styles/index.less'
import '~/styles/index.styl'
import '~/icons'

function getSiteUrl(isvInfo: IsvInfo, name: string): string {
  const site = isvInfo.domain_names.find(x => x.type === name)
  return site ? site.full_prefix : ''
}

function getIsvInfo(isvInfo: IsvInfo) {
  /* eslint-disable global-require */
  return {
    name: isvInfo.isv_desc,
    keyword: isvInfo.keyword,
    description: isvInfo.description,
    favicon: isvInfo.reseller_favicon || require('~/assets/favicon.ico'),
    logo: isvInfo.reseller_logo || require('~/assets/logo.svg'),
    domain: serverRuntimeConfig.domain || isvInfo.domain_names.map(({ prefix }) => prefix).join(','),
    home: serverRuntimeConfig.home || getSiteUrl(isvInfo, 'ecm'),
  }
  /* eslint-enable global-require */
}

class App extends NextApp<AppProps> {
  static async getInitialProps({ Component, ctx }: NextJSAppContext) {
    const { store } = ctx

    let isvName = serverRuntimeConfig.isv
    if (!dev && !isvName) {
      isvName = !ctx.req ? window.location.hostname : ctx.req.headers.host.split(':')[0]
    }
    store.dispatch({ type: 'isvName', value: isvName })

    let isvInfo: IsvInfo
    try {
      const accountApi = new AccountApi(isvName)
      isvInfo = await accountApi.getIsvInfo().toPromise()
    } catch (err) {
    }
    store.dispatch({ type: 'isvInfo', value: getIsvInfo(isvInfo) })

    const pageProps = await loadGetInitialProps(Component, ctx)

    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <ConfigProvider autoInsertSpaceInButton={ false }>
        <Provider store={ store }>
          <Component { ...pageProps } />
        </Provider>
      </ConfigProvider>
    )
  }
}

export default withRedux(initializeStore)(App)
