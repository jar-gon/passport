import { connect } from 'react-redux/es'
import { Component } from '@billypon/react-utils/react'

import { mapState } from '~/utils/redux'

import template from './header.pug'

@connect(mapState([ 'homeUrl' ]))
class Header extends Component {
  render() {
    return template.call(this, { ...this })
  }
}

export default Header
