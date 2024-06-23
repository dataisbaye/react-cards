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

    static getRandomColor(): Color {
        let color = new Color();
        color.r = Math.random();
        color.g = Math.random();
        color.b = Math.random();
        color.a = 1;
        return color;
    }

    static getCost(colors: Color[], bg: Color): number {
        let maxContrast = 21;
        let minContrast = 1;
        let contrastRange = maxContrast - minContrast;

        let n = colors.length;

        let worstBgContrast = colors[0].contrast(bg);
        let worstContrast = n == 1 ? 0 : maxContrast;
        for (let i = 0; i < n; i++) {
            let bgContrast = colors[i].contrast(bg);
            worstBgContrast = Math.min(worstBgContrast, bgContrast);
            for (let j = i + 1; j < n; j++) {
                let contrast = colors[i].contrast(colors[j]);
                worstContrast = Math.min(worstContrast, contrast);
            }
        }

        console.log(`worstContrast: ${worstContrast}, worstBgContrast: ${worstBgContrast}`);
        console.log(((worstContrast+worstBgContrast) - (2*minContrast)) / (2*contrastRange));

        let contrastRatio = Math.max(0.000000001, ((worstContrast+worstBgContrast) - (2*minContrast)) / (2*contrastRange));
        return (- Math.log(contrastRatio));

        /*
        let maxContrast = 21;
        let minContrast = 1;
        let contrastRange = maxContrast - minContrast;
        let sum = 0;

        // Inflate the background contribution to cost because readability is more important than distinguish-ability
        let numColors = colors.length;
        let colorsPlusBg = [...colors];
        for (let i = 0; i < numColors; i++) {
            colorsPlusBg.push(bg);
        }

        let n = colorsPlusBg.length;
        if (n < 2) {
            return 0;
        }
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                let contrast = Math.max(0.000000001, colorsPlusBg[i].contrast(colorsPlusBg[j]) - minContrast);
                sum += (- Math.log(contrast / contrastRange));
            }
        }
        return sum / (n * (n - 1) / 2);
         */
    }

    static prevCost(costs: number[][], colorIdx: number): number {
        let prevColorIdx = colorIdx === 0 ? costs.length - 1 : colorIdx - 1;
        let prevColorCosts = costs[prevColorIdx];
        return prevColorCosts[prevColorCosts.length - 1];
    }

    static getContrastingColors(n: number, existingColors: Color[], bg: Color) {
        //console.log(`getting ${n} contrasting colors`)
        let colors = [];
        let overlaidColors: Color[] = [];
        for (let i = 0; i < n; i++) {
            if (i < existingColors.length) {
                colors.push(existingColors[i]);
            } else {
                colors.push(Color.getRandomColor());
            }
            overlaidColors.push(colors[i].overlayOn(bg));
        }

        // Gradient descent to determine how to modify colors to maximize contrast
        let numRounds = 100;
        let inc = 0.001;

        let costs: number[][] = [];
        let improvements: number[][] = [];
        let learningRates = [];
        let consecutiveImprovements = [];
        for (let i = 0; i < n; i++) {
            costs.push([]);
            improvements.push([]);
            learningRates.push(0.1);
            consecutiveImprovements.push(0);
        }
        costs[0].push(Color.getCost(overlaidColors, bg));
        improvements[0].push(0);

        let sufficientlyMinimalCost = 0.25;
        let maxImprovements = [];
        let maxImprovementThreshold = 0.0000001;
        let minRounds = 10;
        let bumpLearningRateAfter = 5;
        let noImprovementThreshold = 10;

        for (let round = 0; round < numRounds; round++) {
            let startColorIdx = round === 0 ? 1 : 0;
            for (let colorIdx = startColorIdx; colorIdx < n; colorIdx++) {
                let origOverlaidColor = overlaidColors[colorIdx];
                let prevCost = Color.prevCost(costs, colorIdx);

                type MapStrNum = { [key: string]: number };
                let partialDerivatives: MapStrNum = {};
                for (let j of ['r', 'g', 'b', 'a']) {
                    let canIncrease = colors[colorIdx].asDoubleComponent(j) + inc < 1;
                    let needsFlipped = !canIncrease;

                    let newColor = Color.copy(colors[colorIdx]);
                    newColor.set(j, canIncrease ? newColor.get(j) + inc : newColor.get(j) - inc);

                    let newOverlaidColor = newColor.overlayOn(bg);

                    overlaidColors[colorIdx] = newOverlaidColor;
                    let newCost = Color.getCost(overlaidColors, bg);
                    overlaidColors[colorIdx] = origOverlaidColor;

                    let partialDerivative = (prevCost - newCost) / inc;
                    partialDerivatives[j] = needsFlipped ? -partialDerivative : partialDerivative;
                }

                let updatedColor = Color.copy(colors[colorIdx]);
                for (let j of ['r', 'g', 'b']) {
                    let delta = partialDerivatives[j] * learningRates[colorIdx];
                    updatedColor.set(j, Math.min(1, Math.max(0, updatedColor.asDoubleComponent(j) + delta)));
                }

                let updatedOverlaidColor = updatedColor.overlayOn(bg);
                overlaidColors[colorIdx] = updatedOverlaidColor;
                let updatedCost = Color.getCost(overlaidColors, bg);

                // Check if actually improved
                let improvement = Math.max(0, prevCost - updatedCost);
                let improved = improvement > 0;
                if (improved) {
                    colors[colorIdx] = updatedColor;
                    costs[colorIdx].push(updatedCost);
                    improvements[colorIdx].push(improvement);
                    consecutiveImprovements[colorIdx]++;
                    if (consecutiveImprovements[colorIdx] > bumpLearningRateAfter) {
                        learningRates[colorIdx] = Math.min(0.5, learningRates[colorIdx] * 1.5);
                    }
                } else {
                    overlaidColors[colorIdx] = origOverlaidColor;
                    costs[colorIdx].push(prevCost);
                    improvements[colorIdx].push(0);
                    consecutiveImprovements[colorIdx] = 0;
                    learningRates[colorIdx] = Math.max(0.0000001, learningRates[colorIdx] / 3);
                }

                //console.log(`colorIdx: ${colorIdx}, improvement ${improvement}, learningRate ${learningRates[colorIdx]}`);
            }

            // Find max improvement
            let maxImprovement = 0;
            for (let colorIdx = 0; colorIdx < n; colorIdx++) {
                let colorImprovements = improvements[colorIdx];
                let lastImprovement = colorImprovements[colorImprovements.length - 1];
                maxImprovement = Math.max(maxImprovement, lastImprovement);
            }

            maxImprovements.push(maxImprovement);

            // Check if our last several maxImprovements are under the threshold
            let improvingEnough = false;
            for (let i = maxImprovements.length - 1; i >= 0 && i >= maxImprovements.length - noImprovementThreshold; i--) {
                if (maxImprovements[i] > maxImprovementThreshold) {
                    improvingEnough = true;
                    break;
                }
            }

            let lastColorIdx = costs.length - 1;
            let lastColorCosts = costs[lastColorIdx];
            let lastCost = lastColorCosts[lastColorCosts.length - 1];

            console.log(`Round ${round}, maxImprovement ${maxImprovement}, cost ${lastCost}`);

            if (lastCost <= sufficientlyMinimalCost || (!improvingEnough && round >= minRounds)) {
                break;
            }
        }

        return colors;
    }
}

export default Color;