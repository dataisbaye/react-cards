import {v4 as uuidv4} from 'uuid';
import LogLevel, {ILogLevel} from "../enums/logLevel.ts";
import LogSource, {ILogSource} from "../enums/logSource.ts";

type LogLineRow = [string, string, string];

export interface ILogLine {
    id: string;
    source: ILogSource;
    timestamp: string;
    level: ILogLevel;
    message: string;
    dupeIdBefore: string | null;
    dupeIdAfter: string | null;
}

class LogLine {
    static create(source: string, row: LogLineRow): ILogLine {
        return {
            id: uuidv4(),
            source: LogSource.create(source),
            timestamp: row[0],
            level: LogLevel.create(row[1]),
            message: row[2],
            dupeIdBefore: null,
            dupeIdAfter: null,
        };
    }

    static equals(a: ILogLine, b: ILogLine, timeSensitive = true): boolean {
        return a.source === b.source &&
               a.message === b.message &&
               a.level === b.level &&
               (
                   !timeSensitive
                   || LogLine.atSameTimeAs(a, b)
               );
    }

    static before(a: ILogLine, b: ILogLine): boolean {
        return a.timestamp < b.timestamp;
    }

    static after(a: ILogLine, b: ILogLine): boolean {
        return a.timestamp > b.timestamp;
    }

    static atSameTimeAs(a: ILogLine, b: ILogLine): boolean {
        return a.timestamp === b.timestamp;
    }
}

export default LogLine;