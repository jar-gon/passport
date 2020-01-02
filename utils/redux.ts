import { createStore, Store, AnyAction } from 'redux/es/redux'
import { NextJSContext } from 'next-redux-wrapper/es6'
import { browser } from '@billypon/react-utils/common'

import { zipObject } from './array'

export interface IsvInfo {
  name: string
  keyword: string
  description: string
  favicon: string
  logo: string
  domain: string
  home: string
}

interface State {
  isvName: string
  isvInfo: Partial<IsvInfo>
}

const INITIAL_STATE: State = {
  isvName: '',
  isvInfo: { },
}

function reducer(state = INITIAL_STATE, action: AnyAction): State {
  switch (action.type) {
    case 'isvName':
      return { ...state, isvName: action.value }
    case 'isvInfo':
      return { ...state, isvInfo: action.value }
    default:
      return state
  }
}

export const store: { default?: Store } = { }

export function initializeStore(initialState = INITIAL_STATE) {
  if (!browser) {
    return createStore(reducer, initialState)
  }
  store.default = store.default || createStore(reducer, initialState)
  return store.default
}

export interface WithReduxContext extends NextJSContext<State, AnyAction> {
}

export interface ConnectedProps extends State {
}

const defaultKeys = [ 'isvName', 'isvInfo' ]

export function mapState(keys: string[] = [ ]): (state: State) => Partial<ConnectedProps> {
  return (state: State) => {
    const mapKeys = defaultKeys.concat(keys)
    return zipObject(mapKeys, mapKeys.map(x => state[x]))
  }
}
