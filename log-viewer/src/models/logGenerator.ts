import {ILogLevel} from "../enums/logLevel.ts";
import LogLine from "./logLine.ts";
import LogSource from "../enums/logSource.ts";
import moment, {Moment} from "moment";
import LogSourceConfig, {ILogSourceConfig} from "./logSourceConfig.ts";

class LogGenerator {
    constructor() {}

    getRandomSource() {
        return LogSource.getRandomSource().name;
    }

    getRandomTimestamp(lowerBound: Moment, upperBound: Moment): string {
        let lower = lowerBound.valueOf();
        let upper = upperBound.valueOf();

        let ut = Math.floor(Math.random() * (upper - lower + 1)) + lower;
        return moment(ut).format('YYYY-MM-DD HH:mm:ss');
    }

    getRandomLevel(levels: ILogLevel[]) {
        let idx = Math.floor(Math.random() * levels.length);
        idx = 0; // TODO remove
        return levels[idx].name;
    }

    getRandomMessage() {
        let minWords = 1;
        let maxWords = 1;
        let numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
        let words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        let message = [];
        for (let j = 0; j < numWords; j++) {
            let idx = Math.floor(Math.random() * words.length);
            idx = 0; // TODO remove
            message.push(words[idx]);
        }
        return message.join(' ');
    }

    generate(logSourceConfig: ILogSourceConfig, numLogs: number) {
        let logLines = [];
        for (let i = 0; i < numLogs; i++) {
            console.log(`i: ${i}`);
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

        //logLines.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());

        return logLines;
    }
}

export default LogGenerator;