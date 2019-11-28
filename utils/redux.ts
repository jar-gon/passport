import { createStore, Store, AnyAction } from 'redux/es/redux'
import { NextJSContext } from 'next-redux-wrapper/es6'
import { browser } from '@billypon/react-utils/common'

interface State {
  isvName: string
  domain: string
  homeUrl: string
}

const INITIAL_STATE: State = {
  isvName: '',
  domain: '',
  homeUrl: '',
}

function reducer(state = INITIAL_STATE, action: AnyAction): State {
  switch (action.type) {
    case 'isvName':
      return { ...state, isvName: action.value }
    case 'domain':
      return { ...state, domain: action.value }
    case 'homeUrl':
      return { ...state, homeUrl: action.value }
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

export function mapState(keys: string[] = [ ]): (state: State) => Partial<ConnectedProps> {
  return (state: State) => {
    if (!keys.length) {
      return { isvName: state.isvName }
    }
    const newState = { } as State
    Object.keys(state).filter(x => x === 'isvName' || keys.includes(x)).forEach(x => newState[x] = state[x])
    return newState
  }
}
