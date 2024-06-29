import '../extensions/string.ts';
import moment from "moment";
import {DupeModeType, LogLevelType, LogSourceType} from "./types.ts";

export interface ILogSourceConfig {
    name: LogSourceType;
    nameProper: string;
    nameHyphenated: string;
    dupeMode: DupeModeType;
    levels: LogLevelType[];
    startTimestamp: string;
    endTimestamp: string;
}

class LogSourceConfig {
    static timestampFormat = 'YYYY-MM-DD HH:mm:ss';

    static create(name: LogSourceType, levels: Set<LogLevelType>, dupeMode: DupeModeType, startTimestamp: string, endTimestamp: string) {
        return {
            name: name,
            nameProper: name.replace(/_/g, ' ').toTitleCase(),
            nameHyphenated: name.replace(/_/g, '-'),
            levels: Array.from(levels),
            dupeMode: dupeMode,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
        };
    }

    static momentStart(a: ILogSourceConfig) {
        return moment(a.startTimestamp);
    }

    static momentEnd(a: ILogSourceConfig) {
        return moment(a.endTimestamp);
    }
}

export default LogSourceConfig;