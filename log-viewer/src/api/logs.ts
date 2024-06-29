import LogLine, {ILogLine, LogLineRow} from "../models/logLine.ts";


export const getLogs = async (apiUrl: string, apiToken: string, source: string): Promise<ILogLine[]> => {
    let params: {[key: string]: string} = {
        key: apiToken,
        endpoint: 'logs',
        log_name: source,
        //start_at: null,
    };
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    let response = await fetch(`${apiUrl}?${queryString}`);
    let data = await response.json();
    return data.map((row: LogLineRow) => LogLine.create(source, row));
}