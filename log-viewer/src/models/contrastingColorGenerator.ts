import Color from "./color.ts";

export interface ColorHistoryRecord {
    colorIdx: number;
    color: Color;
}

class ContrastingColorGenerator {
    n: number;
    existingColors: Color[];
    bg: Color;

    constructor(n: number, existingColors: Color[], bg: Color) {
        this.n = n;
        this.existingColors = existingColors;
        this.bg = bg;
    }

    getCost(colors: Color[]): number {
        let maxContrast = 21;
        let minContrast = 1;
        let contrastRange = maxContrast - minContrast;

        let n = colors.length;

        let worstBgContrast = colors[0].contrast(this.bg);
        let worstContrast = n == 1 ? 0 : maxContrast;
        for (let i = 0; i < n; i++) {
            let bgContrast = colors[i].contrast(this.bg);
            worstBgContrast = Math.min(worstBgContrast, bgContrast);
            for (let j = i + 1; j < n; j++) {
                let contrast = colors[i].contrast(colors[j]);
                worstContrast = Math.min(worstContrast, contrast);
            }
        }

        let worstBgContrastRatio = Math.max(0.0000001, (worstBgContrast - minContrast) / contrastRange);
        let worstContrastRatio = Math.max(0.0000001, (worstContrast - minContrast) / contrastRange);
        let worstBgContrastCost = (- Math.log(worstBgContrastRatio));
        let worstContrastCost = (- Math.log(worstContrastRatio));
        let avgContrastCost = (worstContrastCost + worstBgContrastCost) / 2;

        return avgContrastCost;
    }

    prevCost(costs: number[][], colorIdx: number): number {
        let prevColorIdx = colorIdx === 0 ? costs.length - 1 : colorIdx - 1;
        let prevColorCosts = costs[prevColorIdx];
        return prevColorCosts[prevColorCosts.length - 1];
    }

    generate() {
        //console.log(`getting ${n} contrasting colors`)
        let colors = [];
        let overlaidColors: Color[] = [];
        for (let i = 0; i < this.n; i++) {
            if (i < this.existingColors.length) {
                colors.push(this.existingColors[i]);
            } else {
                colors.push(Color.getRandomColor());
            }
            overlaidColors.push(colors[i].overlayOn(this.bg));
        }

        // Gradient descent to determine how to modify colors to maximize contrast
        let numRounds = 100;
        let inc = 0.001;

        let costs: number[][] = [];
        let improvements: number[][] = [];
        let learningRates = [];
        let consecutiveImprovements = [];
        for (let i = 0; i < this.n; i++) {
            costs.push([]);
            improvements.push([]);
            learningRates.push(0.1);
            consecutiveImprovements.push(0);
        }
        costs[0].push(this.getCost(overlaidColors));
        improvements[0].push(0);

        let sufficientlyMinimalCost = 0.25;
        let maxImprovements = [];
        let maxImprovementThreshold = 0.0000001;
        let minRounds = 10;
        let bumpLearningRateAfter = 5;
        let noImprovementThreshold = 10;

        let colorHistory: ColorHistoryRecord[] = [];
        for (let round = 0; round < numRounds; round++) {
            let startColorIdx = round === 0 ? 1 : 0;
            for (let colorIdx = startColorIdx; colorIdx < this.n; colorIdx++) {
                let origOverlaidColor = overlaidColors[colorIdx];
                let prevCost = this.prevCost(costs, colorIdx);

                type MapStrNum = { [key: string]: number };
                let partialDerivatives: MapStrNum = {};
                for (let j of ['r', 'g', 'b', 'a']) {
                    let canIncrease = colors[colorIdx].asDoubleComponent(j) + inc < 1;
                    let needsFlipped = !canIncrease;

                    let newColor = Color.copy(colors[colorIdx]);
                    newColor.set(j, canIncrease ? newColor.get(j) + inc : newColor.get(j) - inc);

                    let newOverlaidColor = newColor.overlayOn(this.bg);

                    overlaidColors[colorIdx] = newOverlaidColor;
                    let newCost = this.getCost(overlaidColors);
                    overlaidColors[colorIdx] = origOverlaidColor;

                    let partialDerivative = (prevCost - newCost) / inc;
                    partialDerivatives[j] = needsFlipped ? -partialDerivative : partialDerivative;
                }

                let updatedColor = Color.copy(colors[colorIdx]);
                for (let j of ['r', 'g', 'b']) {
                    let delta = partialDerivatives[j] * learningRates[colorIdx];
                    updatedColor.set(j, Math.min(1, Math.max(0, updatedColor.asDoubleComponent(j) + delta)));
                }

                let updatedOverlaidColor = updatedColor.overlayOn(this.bg);
                overlaidColors[colorIdx] = updatedOverlaidColor;
                let updatedCost = this.getCost(overlaidColors);

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

                    colorHistory.push({
                        colorIdx: colorIdx,
                        color: Color.copy(updatedColor),
                    });
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
            for (let colorIdx = 0; colorIdx < this.n; colorIdx++) {
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

        return colorHistory;
    }
}

export default ContrastingColorGenerator;