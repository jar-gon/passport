import { Component } from '@billypon/react-utils/react'

import { publicRuntimeConfig } from '~/utils/config'

import template from './header.pug'

interface HeaderState {
  home: string
}

class Header extends Component<{ }, HeaderState> {
  getInitialState() {
    return { home: publicRuntimeConfig.PUBLIC_HOME }
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default Header
