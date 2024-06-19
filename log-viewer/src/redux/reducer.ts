import {LogViewerState, initialState} from "./logViewerState.ts";
import { SetLogLinesAction, SetBackgroundColorAction } from './actions.ts';

function logViewerReducer(
    state = initialState,
    action: any
): LogViewerState {
  if (action instanceof SetLogLinesAction) {
    return _onSetLogLines(state, action);
  } else if (action instanceof SetBackgroundColorAction) {
    return _onSetBackgroundColor(state, action);
  } else {
    return state;
  }
}

function _onSetLogLines(state: LogViewerState, action: SetLogLinesAction) {
  return {
    ...state,
    logLines: action.logLines,
  };
}

function _onSetBackgroundColor(state: LogViewerState, action: SetBackgroundColorAction) {
  return {
    ...state,
    backgroundColor: action.color,
  };
}

export const rootReducer = logViewerReducer;
