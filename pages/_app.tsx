import NextApp from 'next/app'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import withRedux, { NextJSAppContext, AppProps } from 'next-redux-wrapper/es6'
import { dev } from '@billypon/react-utils/common'
import '@billypon/react-utils/axios'

import { initializeStore } from '~/utils/redux'
import { publicRuntimeConfig } from '~/utils/config'

import '~/styles/index.less'
import '~/styles/index.styl'
import '~/icons'

class App extends NextApp<AppProps> {
  static async getInitialProps({ Component, ctx }: NextJSAppContext) {
    let isvName = publicRuntimeConfig.PUBLIC_ISV
    if (!dev && !isvName) {
      isvName = !ctx.req ? window.location.hostname : ctx.req.headers.host.split(':')[0]
    }
    ctx.store.dispatch({ type: 'isvName', value: isvName })
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
