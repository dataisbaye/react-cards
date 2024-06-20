const DupeModeMap = {
    SHOW_ALL: 'show_all',
    SHOW_FIRST: 'show_first',
    SHOW_LAST: 'show_last',
}

export interface IDupeMode {
    name: string;
}

class DupeMode {
    static create(name: string): IDupeMode {
        return {
            name: name,
        };
    }

    static equals(a: IDupeMode, b: IDupeMode): boolean {
        return a.name === b.name;
    }

    static SHOW_ALL = DupeMode.create(DupeModeMap.SHOW_ALL);
    static SHOW_FIRST = DupeMode.create(DupeModeMap.SHOW_FIRST);
    static SHOW_LAST = DupeMode.create(DupeModeMap.SHOW_LAST);

    static cache = {
        [DupeModeMap.SHOW_ALL]: DupeMode.SHOW_ALL,
        [DupeModeMap.SHOW_FIRST]: DupeMode.SHOW_FIRST,
        [DupeModeMap.SHOW_LAST]: DupeMode.SHOW_LAST,
    }
}

export default DupeMode;
