import { Component } from '@billypon/react-utils/react'

import { publicRuntimeConfig } from '~/utils/config'

import template from './header.pug'

class Header extends Component {
  homeUrl = publicRuntimeConfig.home

  render() {
    return template.call(this, { ...this })
  }
}

export default Header
