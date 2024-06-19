import LogLevel from '../enums/logLevel.ts';
import LogGenerator from "../models/logGenerator.ts";
import LogLine from '../models/logLine.ts';
import moment from "moment";

export interface LogViewerState {
  logLines: LogLine[];
  backgroundColor: string;
}

// Get all log levels and put in a set
let levels = new Set<LogLevel>(Object.values(LogLevel));
let startTimestamp = moment().subtract(1, 'days');
let endTimestamp = moment();
let logGenerator = new LogGenerator();
let logLines = logGenerator.generate(null, levels, startTimestamp, endTimestamp, 100);

export const initialState: LogViewerState = {
  logLines: logLines,
  backgroundColor: '#000000',
};