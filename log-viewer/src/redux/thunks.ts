import ColorModeEnum from "../enums/colorMode.ts";
import Color from "../models/color.ts";
import ContrastingColorGenerator from "../models/contrastingColorGenerator.ts";
import {
    addLogLines,
    addLogSourceConfig,
    setBackgroundColor,
    setColorMode,
    setLogSourceColor,
    setSelectedSources
} from "./actions.ts";
import {AppThunk} from './store'
import {ColorModeType, LogSourceType} from "../models/types.ts";
import LogGenerator from "../models/logGenerator.ts";
import {getLogs} from "../api/logs.ts";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";

export const updateSelectedSources =
    (
        selectedSources: LogSourceType[],
    ): AppThunk =>
        async (dispatch, getState) => {
            let state = getState();
            dispatch(setSelectedSources(selectedSources));
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
            dispatch(setColorMode(colorMode));
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
            dispatch(setBackgroundColor(backgroundColor));
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
              dispatch(setLogSourceColor({
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
                logs = logGenerator.generate(logSourceConfig, 100);
            }

            dispatch(addLogLines(logs));
            dispatch(addLogSourceConfig(logSourceConfig));
            dispatch(updateSelectedSources(Array.from(selectedSourceSet)));
        }
