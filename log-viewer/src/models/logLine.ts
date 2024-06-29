import {v4 as uuidv4} from 'uuid';
import {DupeModeType, ExpandIconType, LogLevelType, LogSourceType} from "./types.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import ExpandIconEnum from "../enums/expandIcon.ts";

export type LogLineRow = [string, string, string];

export interface ILogLine {
    id: string;
    source: LogSourceType;
    timestamp: string;
    level: LogLevelType;
    message: string;
    explicitExpandIcon: ExpandIconType;
    dupeIdBefore: string | null;
    dupeIdAfter: string | null;
}

class LogLine {
    static create(source: LogSourceType, row: LogLineRow): ILogLine {
        return {
            id: uuidv4(),
            source: source,
            timestamp: row[0],
            level: row[1],
            message: row[2],
            explicitExpandIcon: ExpandIconEnum.NONE,
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

    static compareTimestamps(a: ILogLine, b: ILogLine): number {
        if (LogLine.before(a, b)) {
            return -1;
        } else if (LogLine.after(a, b)) {
            return 1;
        } else {
            return 0;
        }
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

    static isFirst(logLine: ILogLine): boolean {
        return logLine.dupeIdBefore === null;
    }

    static isLast(logLine: ILogLine): boolean {
        return logLine.dupeIdAfter === null;
    }

    static expandIcon(logLine: ILogLine, dupeMode: DupeModeType): ExpandIconType {
        let hasDupe = logLine.dupeIdAfter !== null || logLine.dupeIdBefore !== null;
        if (hasDupe) {
            if (logLine.explicitExpandIcon === ExpandIconEnum.NONE) {
                // Default setting has not been overridden
                switch (dupeMode) {
                    case DupeModeEnum.SHOW_ALL:
                        return ExpandIconEnum.COLLAPSE;
                    case DupeModeEnum.SHOW_FIRST:
                        return LogLine.isFirst(logLine) ? ExpandIconEnum.EXPAND : ExpandIconEnum.COLLAPSE;
                    case DupeModeEnum.SHOW_LAST:
                        return LogLine.isLast(logLine) ? ExpandIconEnum.EXPAND : ExpandIconEnum.COLLAPSE;
                }
            } else {
                // Toggle the setting override
                return logLine.explicitExpandIcon;
            }
        }
        return ExpandIconEnum.NONE;
    }

    static toggleExpandIcon(logLine: ILogLine, dupeMode: DupeModeType): ExpandIconType {
        let expandIcon = LogLine.expandIcon(logLine, dupeMode);
        switch (expandIcon) {
            case ExpandIconEnum.NONE:
                return ExpandIconEnum.NONE;
            case ExpandIconEnum.EXPAND:
                return ExpandIconEnum.COLLAPSE;
            case ExpandIconEnum.COLLAPSE:
                return ExpandIconEnum.EXPAND;
        }
    }
}

export default LogLine;