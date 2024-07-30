import ColorModeEnum from "../enums/colorMode.ts";
import Color from "../models/color.ts";
import ContrastingColorGenerator from "../models/contrastingColorGenerator.ts";
import * as actions from "./actions.ts";
import {AppThunk} from './store'
import {ColorModeType, LogSourceType} from "../models/types.ts";
import LogGenerator from "../models/logGenerator.ts";
import {getLogs} from "../api/logs.ts";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";
import LogLine, {ILogLine} from "../models/logLine.ts";

export const updateLogSourceConfig =
    (
        logSourceConfig: ILogSourceConfig,
        apiUrl: string,
        apiToken: string,
    ): AppThunk =>
        async (dispatch, getState) => {
            let state = getState();

            let oldLogSourceConfig = state.logSourceConfigs[logSourceConfig.name];
            if (oldLogSourceConfig != null
                && (
                    oldLogSourceConfig.startTimestamp < logSourceConfig.startTimestamp
                    || oldLogSourceConfig.endTimestamp > logSourceConfig.endTimestamp
                )) {
                dispatch(updateLogs(
                    logSourceConfig.name,
                    apiUrl,
                    apiToken,
                    logSourceConfig,
                ));
            } else {
                dispatch(actions.addLogSourceConfig(logSourceConfig));
            }
        }

export const updateSelectedSources =
    (
        selectedSources: LogSourceType[],
    ): AppThunk =>
        async (dispatch, getState) => {
            let state = getState();
            dispatch(actions.setSelectedSources(selectedSources));
            dispatch(updateLogSourceColors(
                selectedSources,
                state.colorMode,
                state.backgroundColor,
            ));
        }

export const updateColorMode =
    (
        colorMode: ColorModeType,
    ): AppThunk =>
        async (dispatch, getState) => {
            let state = getState();
            dispatch(actions.setColorMode(colorMode));
            dispatch(updateLogSourceColors(
                state.selectedSources,
                colorMode,
                state.backgroundColor,
            ));
        }

export const updateBackgroundColor =
    (
        backgroundColor: string,
    ): AppThunk =>
        async (dispatch, getState) => {
            let state = getState();
            dispatch(actions.setBackgroundColor(backgroundColor));
            dispatch(updateLogSourceColors(
                state.selectedSources,
                state.colorMode,
                backgroundColor,
            ));
        }

export const updateLogSourceColors =
  (
      selectedSources: LogSourceType[] = null,
      colorMode: ColorModeType = null,
      backgroundColor: string = null,
  ): AppThunk =>
  async (dispatch, getState) => {
      let state = getState();
      selectedSources = selectedSources ?? state.selectedSources;
      colorMode = colorMode ?? state.colorMode;
      backgroundColor = backgroundColor ?? state.backgroundColor;

      // We're assuming we need new colors as long as the colorMode is SOURCE
      if (colorMode === ColorModeEnum.SOURCE) {
          let existingColors = Object.values(state.logSourceColors).map((hex) => Color.fromHex(hex));
          let bgColor = Color.fromHex(backgroundColor);
          existingColors.push(bgColor);
          let numColors = selectedSources.length;
          let colorGenerator = new ContrastingColorGenerator(numColors, existingColors, bgColor);
          let colorHistory = colorGenerator.generate();
          let totalMs = 3000;
          let delay = totalMs / colorHistory.length;
          for (let record of colorHistory) {
              let {colorIdx, color} = record;
              dispatch(actions.setLogSourceColor({
                  source: selectedSources[colorIdx],
                  color: color.asHex(),
              }));

              // Add a 1s delay
              await new Promise(resolve => setTimeout(resolve, delay));
          }
      }
  }

export const updateLogs =
    (
        source: string,
        apiUrl: string,
        apiToken: string,
        logSourceConfig: ILogSourceConfig,
    ): AppThunk =>
        async (dispatch, getState)  => {
            let state = getState();

            let selectedSourceSet = new Set(state.selectedSources);
            selectedSourceSet.add(source);

            let logs = [];
            if (process.env.NODE_ENV !== 'development') {
                let startAt = LogSourceConfig.momentStart(logSourceConfig);
                let endAt = LogSourceConfig.momentEnd(logSourceConfig);
                logs = await getLogs(apiUrl, apiToken, source, startAt, endAt);
            } else {
                let logGenerator = new LogGenerator();
                logs = logGenerator.generate(logSourceConfig, 2400);
            }

            dispatch(mergeLogLines(logs));
            dispatch(actions.addLogSourceConfig(logSourceConfig));
            dispatch(updateSelectedSources(Array.from(selectedSourceSet)));
        }

export const mergeLogLines =
    (
        logLines: ILogLine[]
    ): AppThunk =>
        async (dispatch, getState)  => {
            let state = getState();

            let sourceToLastLogLine: {[key: string]: ILogLine} = {};
            let idToLogLine = JSON.parse(JSON.stringify(state.idToLogLine))

            let cur1 = 0;
            let cur2 = 0;
            let mergedIds = [];
            while (cur1 < state.logLineIds.length || cur2 < logLines.length) {
                if (cur1 >= state.logLineIds.length) {
                    mergedIds.push(logLines[cur2].id);
                    idToLogLine[logLines[cur2].id] = logLines[cur2];
                    cur2++;
                } else if (cur2 >= logLines.length) {
                    mergedIds.push(state.logLineIds[cur1]);
                    cur1++;
                } else {
                    let stateLogLine = idToLogLine[state.logLineIds[cur1]];
                    let logLine = logLines[cur2];
                    if (LogLine.equals(stateLogLine, logLine)) {
                        mergedIds.push(state.logLineIds[cur1]);
                        cur1++;
                        cur2++;
                    } else if (LogLine.before(stateLogLine, logLine)) {
                        mergedIds.push(logLines[cur2].id);
                        idToLogLine[logLines[cur2].id] = logLines[cur2];
                        cur2++;
                    } else {
                        mergedIds.push(state.logLineIds[cur1]);
                        cur1++;
                    }
                }

                let earlierLogLineId = mergedIds[mergedIds.length - 1];
                let earlierLogLine = idToLogLine[earlierLogLineId];
                handleDupes(earlierLogLine, sourceToLastLogLine);

                sourceToLastLogLine[earlierLogLine.source] = earlierLogLine;
            }

            dispatch(actions.setLogLineIds(mergedIds));
            dispatch(actions.setIdToLogLine(idToLogLine));
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
