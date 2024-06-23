import {initialState, LogViewerState} from "./logViewerState.ts";
import * as actions from "./actions.ts";
import {createReducer} from "@reduxjs/toolkit";
import LogSource from "../enums/logSource.ts";
import ColorMode from "../enums/colorMode.ts";
import Color from "../models/color.ts";
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
            state.selectedSources = action.payload.map((source) => LogSource.create(source));
            updateLogSourceColors(state);
        })
        .addCase(actions.addLogSourceConfig, (state, action) => {
            state.logSourceConfigs[action.payload.name] = action.payload;
        })
        .addCase(actions.addLogLines, (state, action) => {
            state.logLines = mergeLogLines(state, action.payload);
        })
        .addCase(actions.setColorMode, (state, action) => {
            state.colorMode = ColorMode.create(action.payload);
            updateLogSourceColors(state);
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
            let logLine = state.logLines.find((line) => line.id === action.payload.id);
            if (logLine) {
                logLine.explicitExpandCollapse = !logLine.explicitExpandCollapse;
            }
        });
    }
);

function getLogSourceColors(state: LogViewerState) {
    let existingColors = Object.values(state.logSourceColors).map((hex) => Color.fromHex(hex));
    let numColors = state.selectedSources.length;
    let backgroundColor = Color.fromHex(state.backgroundColor);
    return Color.getContrastingColors(numColors, existingColors, backgroundColor);
}

function updateLogSourceColors(state: LogViewerState) {
    let needNewColors = state.selectedSources.length !== Object.keys(state.logSourceColors).length;
    if (needNewColors && state.colorMode.name === ColorMode.SOURCE.name) {
        let colors = getLogSourceColors(state);
        state.selectedSources.map((source, idx) => {
            state.logSourceColors[source.name] = colors[idx].asHex();
        });
    }
}

function mergeLogLines(state: LogViewerState, logLines: ILogLine[]): ILogLine[] {
    let sourceToLastLogLine: {[key: string]: ILogLine} = {};
    let idToLogLine: {[key: string]: ILogLine} = {};

    let cur1 = 0;
    let cur2 = 0;
    let merged = [];
    while (cur1 < state.logLines.length || cur2 < logLines.length) {
        if (cur1 >= state.logLines.length) {
            merged.push(logLines[cur2]);
            cur2++;
        } else if (cur2 >= logLines.length) {
            merged.push(state.logLines[cur1]);
            cur1++;
        } else if (LogLine.equals(state.logLines[cur1], logLines[cur2])) {
            merged.push(state.logLines[cur1]);
            cur1++;
            cur2++;
        } else if (LogLine.before(state.logLines[cur1], logLines[cur2])) {
            merged.push(logLines[cur2]);
            cur2++;
        } else {
            merged.push(state.logLines[cur1]);
            cur1++;
        }

        let earlierLogLine = merged[merged.length - 1];
        handleDupes(earlierLogLine, sourceToLastLogLine);

        sourceToLastLogLine[earlierLogLine.source.name] = earlierLogLine;
        idToLogLine[earlierLogLine.id] = earlierLogLine;
    }

    return merged;
}

function handleDupes(earlierLogLine: ILogLine, sourceToLastLogLine: { [key: string]: ILogLine }) {
    earlierLogLine.dupeIdBefore = null;

    let laterLogLine = sourceToLastLogLine[earlierLogLine.source.name];
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