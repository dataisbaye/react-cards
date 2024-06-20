import {initialState} from "./logViewerState.ts";
import * as actions from "./actions.ts";
import {createReducer} from "@reduxjs/toolkit";
import LogSource from "../enums/logSource.ts";
import ColorMode from "../enums/colorMode.ts";

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.setBackgroundColor, (state, action) => {
            state.backgroundColor = action.payload;
        })
        .addCase(actions.openSettings, (state) => {
            state.showSettingsModal = true;
        })
        .addCase(actions.closeSettings, (state) => {
          state.showSettingsModal = false;
        })
        .addCase(actions.setSelectedSources, (state, action) => {
            state.selectedSources = action.payload.map((source) => LogSource.create(source));
        })
        .addCase(actions.addLogSourceConfig, (state, action) => {
            state.logSourceConfigs[action.payload.name] = action.payload;
        })
        .addCase(actions.addLogLines, (state, action) => {
            state.logLines = state.logLines.concat(action.payload);
        })
        .addCase(actions.setColorMode, (state, action) => {
            state.colorMode = ColorMode.create(action.payload);
        })
        .addCase(actions.setHideColorModeDetail, (state, action) => {
            state.hideColorModeDetail = action.payload;
        })
        .addCase(actions.setHideTimestamps, (state, action) => {
            state.hideTimestamps = action.payload;
        })
        .addCase(actions.setHideTimestampYear, (state, action) => {
            state.hideTimestampYear = action.payload;
        });
    }
);