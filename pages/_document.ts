import Document, { Html, Head, Main, NextScript, DocumentInitialProps } from 'next/document'

import { WithReduxContext } from '~/utils/redux'

import template from './_document.pug'

interface DocumentProps {
  keyword: string
  description: string
  favicon: string
}

export default class extends Document<DocumentProps> {
  static async getInitialProps(ctx: WithReduxContext): Promise<DocumentInitialProps & DocumentProps> {
    const { isvInfo } = ctx.store.getState()
    const { keyword, description, favicon } = isvInfo
    const props = await Document.getInitialProps(ctx)
    return {
      ...props,
      keyword,
      description,
      favicon,
    }
  }

  render() {
    return template.call(this, { ...this, Html, Head, Main, NextScript })
  }
}
