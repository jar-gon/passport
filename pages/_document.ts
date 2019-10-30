import Document, { Html, Head, Main, NextScript } from 'next/document'

import template from './_document.pug'

export default class extends Document {
  render() {
    return template({ Html, Head, Main, NextScript })
  }
}
