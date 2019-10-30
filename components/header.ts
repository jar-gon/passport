import { Component } from '@billypon/react-utils/react'

import template from './header.pug'

class Header extends Component {
  render() {
    return template.call(this, { ...this })
  }
}

export default Header
