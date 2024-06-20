import LogLevel, {ILogLevel} from '../enums/logLevel.ts';
import DupeMode from '../enums/dupeMode.ts';
import LogGenerator from "../models/logGenerator.ts";
import ILogLine from '../models/logLine.ts';
import LogSourceConfig, {ILogSourceConfig} from '../models/logSourceConfig.ts';
import moment from "moment";
import ColorMode, {IColorMode} from "../enums/colorMode.ts";
import {ILogSource} from "../enums/logSource.ts";

type MapStrColor = { [key: string]: Color };
type MapStrLogSourceConfig = { [key: string]: ILogSourceConfig};

export interface LogViewerState {
  logLines: ILogLine[];
  selectedSources: ILogSource[];

  // Timestamps
  hideTimestamps: boolean;
  hideTimestampYear: boolean;

  // Color
  colorMode: IColorMode;
  hideColorModeDetail: boolean;
  backgroundColor: string;
  //logSourceColors: MapStrColor;

  // Source configs
  logSourceConfigs: MapStrLogSourceConfig;

  // Settings modal
  showSettingsModal: boolean;
}

// Get all log levels and put in a set
let levels = new Set<ILogLevel>(Object.values(LogLevel.cache));
let startTimestamp = moment().subtract(1, 'days')
let endTimestamp = moment()
let logGenerator = new LogGenerator();
let logLines = logGenerator.generate(null, levels, startTimestamp, endTimestamp, 100);

export const initialState: LogViewerState = {
  logLines: logLines,
  selectedSources: [],

  // Timestamps
  hideTimestamps: false,
  hideTimestampYear: true,

  // Color
  colorMode: ColorMode.LEVEL,
  hideColorModeDetail: true,
  backgroundColor: '#999999',
  //logSourceColors: {},

  // Source configs
  logSourceConfigs: {},

  // Settings modal
  showSettingsModal: true,
};