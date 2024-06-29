import {ILogLine} from '../models/logLine.ts';
import {ILogSourceConfig} from '../models/logSourceConfig.ts';
import ColorModeEnum from "../enums/colorMode.ts";
import {ColorModeType, LogSourceType} from "../models/types.ts";

type MapStrColor = { [key: string]: string };
type MapStrLogSourceConfig = { [key: string]: ILogSourceConfig};
type MapStrLogLine = { [key: string]: ILogLine};

export interface LogViewerState {
  idToLogLine: MapStrLogLine;
  logLineIds: string[];
  selectedSources: LogSourceType[];

  // Timestamps
  hideTimestamps: boolean;
  hideTimestampYear: boolean;

  // Color
  colorMode: ColorModeType;
  hideColorModeDetail: boolean;
  backgroundColor: string;
  logSourceColors: MapStrColor;

  // Source configs
  logSourceConfigs: MapStrLogSourceConfig;

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
  hideColorModeDetail: false,
  backgroundColor: '#000000',
  logSourceColors: {},

  // Source configs
  logSourceConfigs: {},

  // Settings modal
  showSettingsModal: true,
};