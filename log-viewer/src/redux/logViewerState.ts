import {ILogLine} from '../models/logLine.ts';
import {ILogSourceConfig} from '../models/logSourceConfig.ts';
import ColorModeEnum from "../enums/colorMode.ts";
import {ColorModeType, LogSourceType} from "../models/types.ts";

export interface LogViewerState {
  idToLogLine: { [key: string]: ILogLine };
  logLineIds: string[];
  selectedSources: LogSourceType[];

  // Timestamps
  hideTimestamps: boolean;
  hideTimestampYear: boolean;

  // Color
  colorMode: ColorModeType;
  hideColorModeDetail: boolean;
  backgroundColor: string;
  logSourceColors: { [key: string]: string };

  // Source configs
  logSourceConfigs: { [key: string]: ILogSourceConfig };

  // Settings modal
  showSettingsModal: boolean;
}

export const initialState: LogViewerState = {
  idToLogLine: {},
  logLineIds: [],
  selectedSources: [],

  // Timestamps
  hideTimestamps: false,
  hideTimestampYear: true,

  // Color
  colorMode: ColorModeEnum.LEVEL,
  hideColorModeDetail: true,
  backgroundColor: '#000000',
  logSourceColors: {},

  // Source configs
  logSourceConfigs: {},

  // Settings modal
  showSettingsModal: true,
};