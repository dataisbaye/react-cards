import {initialState} from "./logViewerState.ts";
import * as actions from "./actions.ts";
import {createReducer} from "@reduxjs/toolkit";

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
            console.log('setting selected sources');
            state.selectedSources = action.payload.map((source) => source);
        })
        .addCase(actions.addLogSourceConfig, (state, action) => {
            state.logSourceConfigs[action.payload.name] = action.payload;
        })
        .addCase(actions.setLogLineIds, (state, action) => {
            state.logLineIds = action.payload;
        })
        .addCase(actions.setIdToLogLine, (state, action) => {
            state.idToLogLine = action.payload;
        })
        .addCase(actions.setColorMode, (state, action) => {
            state.colorMode = action.payload;
        })
        .addCase(actions.setHideColorModeDetail, (state, action) => {
            state.hideColorModeDetail = action.payload;
        })
        .addCase(actions.setTimestampFormat, (state, action) => {
            state.timestampFormat = action.payload;
        })
        .addCase(actions.setLogSourceConfig, (state, action) => {
            state.logSourceConfigs[action.payload.name] = action.payload;
        })
        .addCase(actions.setStartTimestamp, (state, action) => {
            state.startTimestamp = action.payload;
        })
        .addCase(actions.setEndTimestamp, (state, action) => {
            state.endTimestamp = action.payload;
        })
        .addCase(actions.toggleExpandCollapse, (state, action) => {
            let logLine = state.idToLogLine[action.payload.id];
            if (logLine) {
                // TODO can I just set on logLine? or is that a copy?

                state.idToLogLine[action.payload.id].explicitExpandIcon = action.payload.expandIcon;

                // Set any dupes following this log line
                let afterId = logLine.dupeIdAfter;
                while (afterId != null) {
                    state.idToLogLine[afterId].explicitExpandIcon = action.payload.expandIcon;
                    afterId = state.idToLogLine[afterId].dupeIdAfter;
                }

                // Set any dupes preceding this log line
                let beforeId = logLine.dupeIdBefore;
                while (beforeId != null) {
                    state.idToLogLine[beforeId].explicitExpandIcon = action.payload.expandIcon;
                    beforeId = state.idToLogLine[beforeId].dupeIdBefore;
                }
            }
        })
        .addCase(actions.setLogSourceColor, (state, action) => {
            state.logSourceColors[action.payload.source] = action.payload.color;
        })
        .addCase(actions.setReverse, (state, action) => {
            state.reverse = action.payload;
        });
    }
);
