const ColorModeMap = {
    LEVEL: 'level',
    SOURCE: 'source',
}

export interface IColorMode {
    name: string;
}

class ColorMode {
    static create(name: string): IColorMode {
        return {
            name: name,
        };
    }

    static equals(a: IColorMode, b: IColorMode): boolean {
        return a.name === b.name;
    }

    static LEVEL = ColorMode.create(ColorModeMap.LEVEL);
    static SOURCE = ColorMode.create(ColorModeMap.SOURCE);

    static cache = {
        [ColorModeMap.LEVEL]: ColorMode.LEVEL,
        [ColorModeMap.SOURCE]: ColorMode.SOURCE,
    };
}

export default ColorMode;