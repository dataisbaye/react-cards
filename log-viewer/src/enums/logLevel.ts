type ValueOf<T> = T[keyof T];

const LogLevelEnum = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

export const LogLevelColorEnum: Record<ValueOf<typeof LogLevelEnum>, string> = {
    INFO: '#ffffff',
    WARNING: '#ffcc00',
    ERROR: '#ff0000',
    DEBUG: '#00ff00',
};

export default LogLevelEnum;
