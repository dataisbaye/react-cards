class Color {
    r: number
    g: number
    b: number
    a: number

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        if (r < 0 || r > 1) {
            throw new Error('r must be between 0 and 1');
        }
        if (g < 0 || g > 1) {
            throw new Error('g must be between 0 and 1');
        }
        if (b < 0 || b > 1) {
            throw new Error('b must be between 0 and 1');
        }
        if (a < 0 || a > 1) {
            throw new Error('a must be between 0 and 1');
        }

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static fromInts(r: number, g: number, b: number, a: number): Color {
        let rDub = r / 255;
        let gDub = g / 255;
        let bDub = b / 255;
        let aDub = a / 255;
        return new Color(rDub, gDub, bDub, aDub);
    }

    static fromDoubles(r: number, g: number, b: number, a: number): Color {
        return new Color(r, g, b, a);
    }

    static fromHex(hex: string): Color {
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;
        let a = hex.length === 9 ? parseInt(hex.substring(7, 9), 16) / 255 : 1;
        return new Color(r, g, b, a);
    }

    static copy(other: Color): Color {
        return new Color(other.r, other.g, other.b, other.a);
    }

    get(component: string) {
        switch (component.toLowerCase()) {
            case "r":
                return this.r;
            case "g":
                return this.g;
            case "b":
                return this.b;
            case "a":
                return this.a;
        }
    }

    set(component: string, value: number) {
        switch (component.toLowerCase()) {
            case "r":
                this.r = value;
                break;
            case "g":
                this.g = value;
                break;
            case "b":
                this.b = value;
                break;
            case "a":
                this.a = value;
                break;
        }
    }

    asInt(component: string): number {
        return Math.floor(this.get(component.toLowerCase()) * 255.0);
    }

    asDoubleComponent(component: string): number {
        return this.get(component.toLowerCase());
    }

    asHex(includeAlpha = false) {
        let hex = '#';
        hex += this.asHexComponent("R");
        hex += this.asHexComponent("G");
        hex += this.asHexComponent("B");
        if(includeAlpha) hex += this.asHexComponent("A");
        return hex;
    }

    asHexComponent(component: string): string {
        let val = this.asInt(component);
        let num1 = Math.floor(val / 16);
        let num2 = val % 16;

        let char1 = num1 >= 10 ? String.fromCharCode('a'.charCodeAt(0) + (num1-10)) : String.fromCharCode(num1 + 48);
        let char2 = num2 >= 10 ? String.fromCharCode('a'.charCodeAt(0) + (num2-10)) : String.fromCharCode(num2 + 48);

        let hex = '';
        hex += char1;
        hex += char2;

        return hex;
    }

    static getRandomColor(): Color {
        let color = new Color();
        color.r = Math.random();
        color.g = Math.random();
        color.b = Math.random();
        color.a = 1;
        return color;
    }

    overlayOn(other: Color): Color {
        let myA = this.asDoubleComponent("A");

        if(myA >= 1) {
            return new Color(this.r, this.g, this.b, this.a);
        }

        let myR = this.asDoubleComponent("R");
        let myG = this.asDoubleComponent("G");
        let myB = this.asDoubleComponent("B");

        let otherR = other.asDoubleComponent("R");
        let otherG = other.asDoubleComponent("G");
        let otherB = other.asDoubleComponent("B");

        let otherA = other.asDoubleComponent("A");

        let newR = (myA * myR) + (otherR * otherA * (1 - myA));
        let newG = (myA * myG) + (otherG * otherA * (1 - myA));
        let newB = (myA * myB) + (otherB * otherA * (1 - myA));

        let newA = myA + (otherA * (1 - myA));

        return Color.fromDoubles(newR, newG, newB, newA);
    }

    luminance(): number {
        let newR = this.asDoubleComponent('R')
        newR = newR < .03928 ? newR / 12.92 : Math.pow((newR + .055) / 1.055, 2.4);

        let newG = this.asDoubleComponent('G');
        newG = newG < .03928 ? newG / 12.92 : Math.pow((newG + .055) / 1.055, 2.4);

        let newB = this.asDoubleComponent('B');
        newB = newB < .03928 ? newB / 12.92 : Math.pow((newB + .055) / 1.055, 2.4);

        return .2126 * newR + .7152 * newG + 0.0722 * newB;
    }

    contrast(other: Color): number {
        let myA = this.asDoubleComponent("A");

        if(myA >= 1) {
            let otherA = other.asDoubleComponent("A");

            if(otherA < 1) {
                other = other.overlayOn(this);
            }

            let l1 = this.luminance() + .05;
            let l2 = other.luminance() + .05;

            let ratio = l1 / l2;
            if(l2 > l1) {
                ratio = 1 / ratio;
            }

            return ratio;
        }

        let black = new Color(0, 0, 0, 1);
        let onBlack = this.overlayOn(black);
        let white = new Color(1, 1, 1, 1);
        let onWhite = this.overlayOn(white);

        let contrastOnBlack = onBlack.contrast(other);
        let contrastOnWhite = onWhite.contrast(other);

        let cmax = Math.max(contrastOnBlack, contrastOnWhite);

        let cmin = 1;
        if(onBlack.luminance() > other.luminance()) {
            cmin = contrastOnBlack;
        } else if (onWhite.luminance() < other.luminance()) {
            cmin = contrastOnWhite;
        }

        return (cmin + cmax) / 2;
    }
}

export default Color;