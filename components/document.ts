import { store } from '~/utils/redux'

export function FullTitle({ children }: { children: string }) {
  document.title = children
  return ''
}

export function Title({ children }: { children: string }) {
  const { isvInfo } = store.default.getState()
  return FullTitle({ children: `${ children } - ${ isvInfo.name }` })
}

export default { Title, FullTitle }
