import NextApp from 'next/app'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import withRedux, { NextJSAppContext, AppProps } from 'next-redux-wrapper/es6'
import { dev } from '@billypon/react-utils/common'
import '@billypon/react-utils/axios'

import { initializeStore } from '~/utils/redux'
import { serverRuntimeConfig } from '~/utils/config'

import '~/styles/index.less'
import '~/styles/index.styl'
import '~/icons'

class App extends NextApp<AppProps> {
  static async getInitialProps({ Component, ctx }: NextJSAppContext) {
    const { store } = ctx
    if (!store.getState().isvName) {
      let isvName = serverRuntimeConfig.isv
      if (!dev && !isvName) {
        isvName = !ctx.req ? window.location.hostname : ctx.req.headers.host.split(':')[0]
      }
      store.dispatch({ type: 'isvName', value: isvName })
      store.dispatch({ type: 'homeUrl', value: serverRuntimeConfig.home })
      store.dispatch({ type: 'consoleUrl', value: serverRuntimeConfig.console })
    }
    const pageProps = await loadGetInitialProps(Component, ctx)
    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store={ store }>
        <Component { ...pageProps } />
      </Provider>
    )
  }
}

export default withRedux(initializeStore)(App)
