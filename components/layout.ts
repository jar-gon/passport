import { Component } from '@billypon/react-utils/react'

import Header from './header'
import template from './layout.pug'

interface LayoutProps {
  footer: boolean
}

class Layout extends Component<LayoutProps> {
  render() {
    return template.call(this, { ...this, Header })
  }
}

export default Layout
