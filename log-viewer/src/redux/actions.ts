import {createAction} from "@reduxjs/toolkit";
import {ILogSourceConfig} from "../models/logSourceConfig.ts";
import {ILogLine} from "../models/logLine.ts";

export const setBackgroundColor = createAction<string>('SET_BACKGROUND_COLOR');
export const openSettings = createAction('OPEN_SETTINGS');
export const closeSettings = createAction('CLOSE_SETTINGS');
export const setSelectedSources = createAction<string[]>('SET_SELECTED_SOURCES');
export const addLogSourceConfig = createAction<ILogSourceConfig>('ADD_LOG_SOURCE_CONFIG');
export const addLogLines = createAction<ILogLine[]>('ADD_LOG_LINES');
export const setColorMode = createAction<string>('SET_COLOR_MODE');
export const setHideColorModeDetail = createAction<boolean>('SET_HIDE_COLOR_MODE_DETAIL');
export const setHideTimestamps = createAction<boolean>('SET_HIDE_TIMESTAMPS');
export const setHideTimestampYear = createAction<boolean>('SET_HIDE_TIMESTAMP_YEAR');
export const setLogSourceConfig = createAction<ILogSourceConfig>('SET_LOG_SOURCE_CONFIG');
export const toggleExpandCollapse = createAction<ILogLine>('TOGGLE_EXPAND_COLLAPSE');
