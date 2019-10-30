/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

const React = require('react')

declare module '*.pug' {
  const template: (params?: { [key: string]: any }) => React.ReactElement
  export = template
}
