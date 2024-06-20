const LogSourceMap = {
    ERROR_LOG: "error_log",
    MAIN_LOG: "main_log",
    ACCESS_LOG: "access_log",
    DIAG_LOG: "diag_log",

    AIR_GRADIENT: "air_gradient",
    ALARM: "alarm",
    BIBLE_STUDY: "bible_study",
    CALENDAR: "calendar",
    DATABASE_MANAGER: "database_manager",
    DEVICE: "device",
    DINING_ROOM: "dining_room",
    ENERGY: "energy",
    FITBIT: "fitbit",
    GYM: "gym",
    CRAWLER: "crawler",
    LIVING_ROOM: "living_room",
    MEDIA_PLAYER: "media_player",
    PHONE: "phone",
    SITE_DATA: "site_data",
    SYSTEM: "system",
    USER: "user",
    WARN_LOG: "warn_log",
    WEATHER: "weather",
    WHITE_NOISE: "white_noise",
};

export interface ILogSource {
    name: string;
}

class LogSource {
    static create(name: string): ILogSource {
        return {
            name: name,
        };
    }

    equals(a: ILogSource, b: ILogSource): boolean {
        return a.name === b.name;
    }

    static getRandomSource(): ILogSource {
        let keys = Object.keys(LogSource.cache);
        let idx = Math.floor(Math.random() * keys.length);
        return LogSource.cache[keys[idx]];
    }

    static ERROR_LOG = LogSource.create(LogSourceMap.ERROR_LOG);
    static MAIN_LOG = LogSource.create(LogSourceMap.MAIN_LOG);
    static ACCESS_LOG = LogSource.create(LogSourceMap.ACCESS_LOG);
    static DIAG_LOG = LogSource.create(LogSourceMap.DIAG_LOG);

    static AIR_GRADIENT = LogSource.create(LogSourceMap.AIR_GRADIENT);
    static ALARM = LogSource.create(LogSourceMap.ALARM);
    static BIBLE_STUDY = LogSource.create(LogSourceMap.BIBLE_STUDY);
    static CALENDAR = LogSource.create(LogSourceMap.CALENDAR);
    static CRAWLER = LogSource.create(LogSourceMap.CRAWLER);
    static DATABASE_MANAGER = LogSource.create(LogSourceMap.DATABASE_MANAGER);
    static DEVICE = LogSource.create(LogSourceMap.DEVICE);
    static DINING_ROOM = LogSource.create(LogSourceMap.DINING_ROOM);
    static ENERGY = LogSource.create(LogSourceMap.ENERGY);
    static FITBIT = LogSource.create(LogSourceMap.FITBIT);
    static GYM = LogSource.create(LogSourceMap.GYM);
    static LIVING_ROOM = LogSource.create(LogSourceMap.LIVING_ROOM);
    static MEDIA_PLAYER = LogSource.create(LogSourceMap.MEDIA_PLAYER);
    static PHONE = LogSource.create(LogSourceMap.PHONE);
    static SITE_DATA = LogSource.create(LogSourceMap.SITE_DATA);
    static SYSTEM = LogSource.create(LogSourceMap.SYSTEM);
    static USER = LogSource.create(LogSourceMap.USER);
    static WARN_LOG = LogSource.create(LogSourceMap.WARN_LOG);
    static WEATHER = LogSource.create(LogSourceMap.WEATHER);
    static WHITE_NOISE = LogSource.create(LogSourceMap.WHITE_NOISE);

    static cache = {
        [LogSourceMap.ERROR_LOG]: LogSource.ERROR_LOG,
        [LogSourceMap.MAIN_LOG]: LogSource.MAIN_LOG,
        [LogSourceMap.ACCESS_LOG]: LogSource.ACCESS_LOG,
        [LogSourceMap.DIAG_LOG]: LogSource.DIAG_LOG,
        [LogSourceMap.AIR_GRADIENT]: LogSource.AIR_GRADIENT,
        [LogSourceMap.ALARM]: LogSource.ALARM,
        [LogSourceMap.BIBLE_STUDY]: LogSource.BIBLE_STUDY,
        [LogSourceMap.CALENDAR]: LogSource.CALENDAR,
        [LogSourceMap.CRAWLER]: LogSource.CRAWLER,
        [LogSourceMap.DATABASE_MANAGER]: LogSource.DATABASE_MANAGER,
        [LogSourceMap.DEVICE]: LogSource.DEVICE,
        [LogSourceMap.DINING_ROOM]: LogSource.DINING_ROOM,
        [LogSourceMap.ENERGY]: LogSource.ENERGY,
        [LogSourceMap.FITBIT]: LogSource.FITBIT,
        [LogSourceMap.GYM]: LogSource.GYM,
        [LogSourceMap.LIVING_ROOM]: LogSource.LIVING_ROOM,
        [LogSourceMap.MEDIA_PLAYER]: LogSource.MEDIA_PLAYER,
        [LogSourceMap.PHONE]: LogSource.PHONE,
        [LogSourceMap.SITE_DATA]: LogSource.SITE_DATA,
        [LogSourceMap.SYSTEM]: LogSource.SYSTEM,
        [LogSourceMap.USER]: LogSource.USER,
        [LogSourceMap.WARN_LOG]: LogSource.WARN_LOG,
        [LogSourceMap.WEATHER]: LogSource.WEATHER,
        [LogSourceMap.WHITE_NOISE]: LogSource.WHITE_NOISE,
    }
}

export default LogSource;