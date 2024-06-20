const LogLevelMap = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    DEBUG: 'debug',
}

const LogLevelColorMap: {[key: string]: string} = {
    INFO: '#ffffff',
    WARNING: '#ffcc00',
    ERROR: '#ff0000',
    DEBUG: '#00ff00',
}

export interface ILogLevel {
    name: string;
}

class LogLevel {
    static create(name: string): ILogLevel {
        return {
            name: name,
        };
    }

    static color(a: ILogLevel): string {
        return LogLevelColorMap[a.name.toUpperCase()];
    }

    static equals(a: ILogLevel, b: ILogLevel): boolean {
        return a.name === b.name;
    }

    static getRandomLevel(): ILogLevel {
        let keys = Object.keys(LogLevel.cache);
        let idx = Math.floor(Math.random() * keys.length);
        return LogLevel.cache[keys[idx]];
    }

    static INFO = LogLevel.create(LogLevelMap.INFO);
    static WARNING = LogLevel.create(LogLevelMap.WARNING);
    static ERROR = LogLevel.create(LogLevelMap.ERROR);
    static DEBUG = LogLevel.create(LogLevelMap.DEBUG);

    static cache = {
        [LogLevelMap.INFO]: LogLevel.INFO,
        [LogLevelMap.WARNING]: LogLevel.WARNING,
        [LogLevelMap.ERROR]: LogLevel.ERROR,
        [LogLevelMap.DEBUG]: LogLevel.DEBUG,
    }
}

export default LogLevel;