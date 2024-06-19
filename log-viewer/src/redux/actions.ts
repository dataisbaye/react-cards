import LogLine from "../models/logLine.ts";

export class SetLogLinesAction {
  logLines: LogLine[];

    constructor(logLines: LogLine[]) {
        this.logLines = logLines;
    }
}

export class SetBackgroundColorAction {
  color: string;

    constructor(color: string) {
        this.color = color;
    }
}