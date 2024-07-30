import {ILogLine} from '../models/logLine.ts';
import {ILogSourceConfig} from '../models/logSourceConfig.ts';
import ColorModeEnum from "../enums/colorMode.ts";
import {ColorModeType, LogSourceType} from "../models/types.ts";
import moment from "moment";

const timestampFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
const now = moment()
const sixHoursAgo = now.clone().subtract(6, 'hours');

export interface LogViewerState {
  idToLogLine: { [key: string]: ILogLine };
  logLineIds: string[];
  selectedSources: LogSourceType[];

  // Time Range
  startTimestamp: string;
  endTimestamp: string;

  // Timestamps
  timestampFormat: string;
  reverse: boolean;

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

  // Time Range
  startTimestamp: sixHoursAgo.format(timestampFormat),
  endTimestamp: now.format(timestampFormat),

  // Timestamps
  timestampFormat: timestampFormat,
  reverse: false,

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