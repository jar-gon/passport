import { connect } from 'react-redux/es'
import { Component } from '@billypon/react-utils/react'

import { mapState } from '~/utils/redux'
import { getRedirectQuery } from '~/utils/common'

import template from './header.pug'

interface HeaderState {
  redirectQuery: string
}

@connect(mapState)
class Header extends Component<HeaderState> {
  getInitialState() {
    return { redirectQuery: getRedirectQuery() }
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default Header
