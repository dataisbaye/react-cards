import {IDupeMode} from "../enums/dupeMode.ts";
import '../extensions/string.ts';
import {ILogLevel} from "../enums/logLevel.ts";
import moment from "moment";

export interface ILogSourceConfig {
    name: string;
    nameProper: string;
    nameHyphenated: string;
    dupeMode: IDupeMode;
    levels: ILogLevel[];
    startTimestamp: string;
    endTimestamp: string;
}

class LogSourceConfig {
    static timestampFormat = 'YYYY-MM-DD HH:mm:ss';

    static create(name: string, levels: Set<ILogLevel>, dupeMode: IDupeMode, startTimestamp: string, endTimestamp: string) {
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