import { createStore, AnyAction } from 'redux/es/redux'
import { NextJSContext } from 'next-redux-wrapper/es6'

interface State {
  isvName: string
  homeUrl: string
}

const INITIAL_STATE: State = {
  isvName: '',
  homeUrl: '',
}

function reducer(state = INITIAL_STATE, action: AnyAction): State {
  switch (action.type) {
    case 'isvName':
      return { ...state, isvName: action.value }
    case 'homeUrl':
      return { ...state, homeUrl: action.value }
    default:
      return state
  }
}

export function initializeStore(initialState = INITIAL_STATE) {
  return createStore(reducer, initialState)
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
