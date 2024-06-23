import {ILogLine} from '../models/logLine.ts';
import {ILogSourceConfig} from '../models/logSourceConfig.ts';
import ColorMode, {IColorMode} from "../enums/colorMode.ts";
import {ILogSource} from "../enums/logSource.ts";

type MapStrColor = { [key: string]: string };
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
  logSourceColors: MapStrColor;

  // Source configs
  logSourceConfigs: MapStrLogSourceConfig;

  // Settings modal
  showSettingsModal: boolean;
}

export const initialState: LogViewerState = {
  logLines: [],
  selectedSources: [],

  // Timestamps
  hideTimestamps: false,
  hideTimestampYear: true,

  // Color
  colorMode: ColorMode.LEVEL,
  hideColorModeDetail: false,
  backgroundColor: '#000000',
  logSourceColors: {},

  // Source configs
  logSourceConfigs: {},

  // Settings modal
  showSettingsModal: true,
};