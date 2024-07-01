import LogLine, {ILogLine, LogLineRow} from "../models/logLine.ts";
import {Moment} from "moment";


export const getLogs = async (apiUrl: string, apiToken: string, source: string, startAt: Moment, endAt: Moment): Promise<ILogLine[]> => {
    let timestampFormat = 'YYYY-MM-DD HH:mm:ss';
    let params: {[key: string]: string} = {
        key: apiToken,
        endpoint: 'logs',
        log_name: source,
        start_at: startAt.format(timestampFormat),
        end_at: endAt.format(timestampFormat),
    };
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    let response = await fetch(`${apiUrl}?${queryString}`);
    let data = await response.json();
    return data.data.map((row: LogLineRow) => LogLine.create(source, row));
}