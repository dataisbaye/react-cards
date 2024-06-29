import {configureStore} from '@reduxjs/toolkit';
import {reducer} from "./reducer.ts";
import {ThunkAction} from "redux-thunk";
import {UnknownAction} from "redux";





export const store = configureStore({
    reducer: reducer,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>