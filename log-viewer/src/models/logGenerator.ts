import LogLevel from "../enums/logLevel.ts";
import LogLine from "./logLine.ts";
import LogSource from "../enums/logSource.ts";
import moment, {Moment} from "moment";

class LogGenerator {
    constructor() {}

    getRandomSource() {
        let sources = Object.keys(LogSource);
        let idx = Math.floor(Math.random() * sources.length);
        //idx = 0; // TODO remove
        return sources[idx];
    }

    getRandomTimestamp(lowerBound: Moment, upperBound: Moment): string {
        let lower = lowerBound.valueOf();
        let upper = upperBound.valueOf();

        let ut = Math.floor(Math.random() * (upper - lower + 1)) + lower;
        return moment(ut).format('YYYY-MM-DD HH:mm:ss');
    }

    getRandomLevel(levels: Set<LogLevel>) {
        let idx = Math.floor(Math.random() * levels.size);
        //idx = 0; // TODO remove
        return Array.from(levels.values())[idx];
    }

    getRandomMessage() {
        let minWords = 1;
        let maxWords = 1;
        let numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
        let words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        let message = [];
        for (let j = 0; j < numWords; j++) {
            let idx = Math.floor(Math.random() * words.length);
            //idx = 0; // TODO remove
            message.push(words[idx]);
        }
        return message.join(' ');
    }

    generate(source: string, levels: Set<LogLevel>, startTimestamp: Moment, endTimestamp: Moment, numLogs: number) {
        source = source || this.getRandomSource();

        let logLines = [];
        for (let i = 0; i < numLogs; i++) {
            console.log(`i: ${i}`);
            let logLine = new LogLine(
                source,
                [
                    this.getRandomTimestamp(startTimestamp, endTimestamp),
                    this.getRandomLevel(levels),
                    this.getRandomMessage(),
                ],
            );
            logLines.push(logLine);
        }

        logLines.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());

        return logLines;
    }
}

export default LogGenerator;