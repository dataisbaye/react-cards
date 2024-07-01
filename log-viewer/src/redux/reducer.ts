import {initialState, LogViewerState} from "./logViewerState.ts";
import * as actions from "./actions.ts";
import {createReducer} from "@reduxjs/toolkit";
import LogLine, {ILogLine} from "../models/logLine.ts";

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
        .addCase(actions.addLogLines, (state, action) => {
            mergeLogLines(state, action.payload);
        })
        .addCase(actions.setColorMode, (state, action) => {
            state.colorMode = action.payload;
        })
        .addCase(actions.setHideColorModeDetail, (state, action) => {
            state.hideColorModeDetail = action.payload;
        })
        .addCase(actions.setHideTimestamps, (state, action) => {
            state.hideTimestamps = action.payload;
        })
        .addCase(actions.setHideTimestampYear, (state, action) => {
            state.hideTimestampYear = action.payload;
        })
        .addCase(actions.setLogSourceConfig, (state, action) => {
            state.logSourceConfigs[action.payload.name] = action.payload;
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
        });
    }
);

function mergeLogLines(state: LogViewerState, logLines: ILogLine[]) {
    let sourceToLastLogLine: {[key: string]: ILogLine} = {};

    let cur1 = 0;
    let cur2 = 0;
    let mergedIds = [];
    while (cur1 < state.logLineIds.length || cur2 < logLines.length) {
        if (cur1 >= state.logLineIds.length) {
            mergedIds.push(logLines[cur2].id);
            state.idToLogLine[logLines[cur2].id] = logLines[cur2];
            cur2++;
        } else if (cur2 >= logLines.length) {
            mergedIds.push(state.logLineIds[cur1]);
            cur1++;
        } else {
            let stateLogLine = state.idToLogLine[state.logLineIds[cur1]];
            let logLine = logLines[cur2];
            if (LogLine.equals(stateLogLine, logLine)) {
                mergedIds.push(state.logLineIds[cur1]);
                cur1++;
                cur2++;
            } else if (LogLine.before(stateLogLine, logLine)) {
                mergedIds.push(logLines[cur2].id);
                state.idToLogLine[logLines[cur2].id] = logLines[cur2];
                cur2++;
            } else {
                mergedIds.push(state.logLineIds[cur1]);
                cur1++;
            }
        }

        let earlierLogLineId = mergedIds[mergedIds.length - 1];
        let earlierLogLine = state.idToLogLine[earlierLogLineId];
        handleDupes(earlierLogLine, sourceToLastLogLine);

        sourceToLastLogLine[earlierLogLine.source] = earlierLogLine;
    }

    state.logLineIds = mergedIds;
}

function handleDupes(earlierLogLine: ILogLine, sourceToLastLogLine: { [key: string]: ILogLine }) {
    earlierLogLine.dupeIdBefore = null;

    let laterLogLine = sourceToLastLogLine[earlierLogLine.source];
    if (laterLogLine == null) {
        earlierLogLine.dupeIdAfter = null;
    } else {
        let areDupes = LogLine.equals(earlierLogLine, laterLogLine, false);
        if (areDupes) {
            earlierLogLine.dupeIdAfter = laterLogLine.id;
            laterLogLine.dupeIdBefore = earlierLogLine.id;
        } else {
            earlierLogLine.dupeIdAfter = null;
        }
    }
}