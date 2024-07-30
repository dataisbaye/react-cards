import LogLine from "./logLine.ts";
import moment, {Moment} from "moment";
import LogSourceConfig, {ILogSourceConfig} from "./logSourceConfig.ts";
import LogSourceEnum from "../enums/logSource.ts";
import {LogLevelType} from "./types.ts";

class LogGenerator {
    constructor() {}

    getRandomSource() {
        let sources = Object.values(LogSourceEnum);
        let idx = Math.floor(Math.random() * sources.length);
        return sources[idx];
    }

    getRandomTimestamp(lowerBound: Moment, upperBound: Moment): string {
        let lower = lowerBound.valueOf();
        let upper = upperBound.valueOf();

        let ut = Math.floor(Math.random() * (upper - lower + 1)) + lower;
        return moment(ut).format('YYYY-MM-DD HH:mm:ss');
    }

    getRandomLevel(levels: LogLevelType[]) {
        let idx = Math.floor(Math.random() * levels.length);
        return levels[idx];
    }

    getRandomMessage() {
        let minWords = 3;
        let maxWords = 50;
        let numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
        let words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        let message = [];
        for (let j = 0; j < numWords; j++) {
            let idx = Math.floor(Math.random() * words.length);
            message.push(words[idx]);
        }
        return message.join(' ');
    }

    generate(logSourceConfig: ILogSourceConfig, numLogs: number) {
        let preDupePercent = 0.7;
        let logLines = [];
        let numPreDupeLogs = Math.floor(numLogs * preDupePercent);
        for (let i = 0; i < numPreDupeLogs; i++) {
            let logLine = LogLine.create(
                logSourceConfig.name,
                [
                    this.getRandomTimestamp(LogSourceConfig.momentStart(logSourceConfig), LogSourceConfig.momentEnd(logSourceConfig)),
                    this.getRandomLevel(logSourceConfig.levels),
                    this.getRandomMessage(),
                ],
            );
            logLines.push(logLine);
        }

        logLines.sort((a, b) => {
            return LogLine.compareTimestamps(b, a);
        });

        // Inject some dupes
        let numDupeLogs = numLogs - numPreDupeLogs;
        for (let i = 0; i < numDupeLogs; i++) {
            let idx = Math.floor(Math.random() * numPreDupeLogs);
            let logLine = LogLine.create(
                logSourceConfig.name,
                [
                    logLines[idx].timestamp,
                    logLines[idx].level,
                    logLines[idx].message,
                ],
            );
            logLines.push(logLine);
        }

        logLines.sort((a, b) => {
            return LogLine.compareTimestamps(b, a);
        });

        return logLines;
    }
}

export default LogGenerator;