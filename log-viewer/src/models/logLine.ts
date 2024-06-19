import moment, {Moment} from "moment";
import {v4 as uuidv4} from 'uuid';

type LogLineRow = [string, string, string];

class LogLine {
    id: string;
    source: string;
    timestamp: Moment;
    timestampFormat: string;
    level: string;
    message: string;
    dupeIdBefore: string | null;
    dupeIdAfter: string | null;

    constructor(source: string, logLineRow: LogLineRow) {
        this.id = uuidv4();
        this.source = source;
        this.timestampFormat = 'YYYY-MM-DD HH:mm:ss';
        this.timestamp = moment(logLineRow[0], this.timestampFormat);
        this.level = logLineRow[1];
        this.message = logLineRow[2];
        this.dupeIdBefore = null;
        this.dupeIdAfter = null;
    }

    equals(other: LogLine, timeSensitive = true): boolean {
        return this.source === other.source &&
               this.message === other.message &&
               this.level === other.level &&
               (
                   !timeSensitive
                   || this.atSameTimeAs(other)
               );
    }

    before(other: LogLine): boolean {
        return this.timestamp < other.timestamp;
    }

    after(other: LogLine): boolean {
        return this.timestamp > other.timestamp;
    }

    atSameTimeAs(other: LogLine): boolean {
        return this.timestamp === other.timestamp;
    }
}

export default LogLine;