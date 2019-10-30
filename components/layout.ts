import { ChangeEvent } from 'react'
import router from 'next/router'
import { Component } from '@billypon/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import Header from './header'
import template from './layout.pug'

interface LayoutProps {
  headerSearch: boolean
  contentHeader: boolean
  footer: boolean
}

interface LayoutState {
  keyword: string
}

class Layout extends Component<LayoutProps, LayoutState> {
  @autobind()
  search(): void {
    router.push(`/products?keyword=${ this.state.keyword }`)
  }

  @autobind()
  updateKeyword({ target: { value } }: ChangeEvent<HTMLInputElement>): void {
    this.setState({ keyword: value })
  }

  render() {
    return template.call(this, { ...this, Header })
  }
}

export default Layout
