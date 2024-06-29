import ColorModeEnum from "../enums/colorMode.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import ExpandIconEnum from "../enums/expandIcon.ts";
import LogLevelEnum, {LogLevelColorEnum} from "../enums/logLevel.ts";
import LogSourceEnum from "../enums/logSource.ts";

type ValueOf<T> = T[keyof T];

export type ColorModeType = ValueOf<typeof ColorModeEnum>;
export type DupeModeType = ValueOf<typeof DupeModeEnum>;
export type ExpandIconType = ValueOf<typeof ExpandIconEnum>;
export type LogLevelType = ValueOf<typeof LogLevelEnum>;
export type LogLevelColorType = ValueOf<typeof LogLevelColorEnum>;
export type LogSourceType = ValueOf<typeof LogSourceEnum>;
