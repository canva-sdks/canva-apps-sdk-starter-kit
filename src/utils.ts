import { Color } from "@canva/asset"

type RGB = {
    r: number
    g: number
    b: number
}

type HSL = {
    h: number
    s: number
    l: number
}

const hexToRGB = (hex: string): RGB => {

    // convering hex to RGB
    const bigint = parseInt(hex.substring(1), 16);
    const red = ((bigint >> 16) & 255);
    const green = ((bigint >> 8) & 255);
    const blue = (bigint & 255);
    
    return { r: red, g: green, b: blue };
};

function addPadding(hexComponent: string): string {
    if (hexComponent.length < 2) {
        hexComponent = "0" + hexComponent
    }

    return hexComponent
}

function RGBToHex(color: RGB): string {
    const redHex = addPadding(color.r.toString(16))
    const greenHex = addPadding(color.g.toString(16))
    const blueHex = addPadding(color.b.toString(16))

    return "#" + redHex + greenHex + blueHex
}

/**
 * Converts color in RGB to linear RGB.
 * 
 * @param color Color in RGB.
 * @returns Color in Linear RGB.
 */
function RGBToLinearRGB(color: RGB): RGB {
    const redsRGB: number = color.r/255
    const greensRGB: number = color.g/255
    const blueSRGB: number = color.b/255

    const redLinear: number = ((redsRGB <= 0.03928) ? redsRGB/12.92 : ((redsRGB +0.055)/1.055) ** 2.4)
    const greenLinear: number = ((greensRGB <= 0.03928) ? greensRGB/12.92 : ((greensRGB +0.055)/1.055) ** 2.4)
    const blueLinear: number = ((blueSRGB <= 0.03928) ? blueSRGB/12.92 : ((blueSRGB +0.055)/1.055) ** 2.4)

    return { r: redLinear, g: greenLinear, b: blueLinear }
}

/**
 * Calculates relative luminance of color.
 * 
 * @param color Color in RGB.
 * @returns Relative luminance.
 */
function findRelativeLuminance(color: RGB) {
    const colorLinear: RGB = RGBToLinearRGB(color)

    const lum: number = 0.2126 * colorLinear.r + 0.7152 * colorLinear.g + 0.0722 * colorLinear.b

    return lum
}

export const calculateContrastHex = (fgHex: string, bgHex: string): number => {
    
    const fg = hexToRGB(fgHex);
    const bg = hexToRGB(bgHex);

    return calculateContrastRGB(fg, bg);
};

/**
 * Calculates contrast ratio of the two colors in RGB.
 * 
 * @param fg Foreground color in RGB.
 * @param bg Background color in RGB.
 * @returns Contrast ratio.
 */
function calculateContrastRGB(fg: RGB, bg: RGB) {
    const lumFG: number = findRelativeLuminance(fg)
    const lumBG: number = findRelativeLuminance(bg)

    let ratio: number = (lumFG + 0.05) / (lumBG + 0.05)
    //Contrast ratio must always be >= 1
    if (ratio < 1) {
        ratio = 1/ratio
    }

    ratio = Math.trunc(ratio * 100) / 100

    return ratio
}

export const scorePass = (contrastScore: number): boolean => {
    return contrastScore > 7;
};

/**
 * Converts color in RGB to HSL.
 * 
 * @param color Color in RGB.
 * @returns Color in HSL.
 */
function RGBtoHSL(color: RGB): HSL {
    const r = color.r / 255
    const g = color.g / 255
    const b = color.b / 255

    const x_max: number = Math.max(r, g, b)
    const x_min: number = Math.min(r, g, b)
    const c: number = x_max - x_min
    const l: number = (x_max + x_min) / 2
    let h: number
    let s: number

    if (c == 0) {
        h = 0
    }
    else if (x_max == r) {
        h = 60 * (((((g - b) / c) % 6) + 6) % 6)
    }
    else if(x_max == g) {
        h = 60 * (((b - r) / c) + 2)
    }
    else {
        h = 60 * (((r - g) / c) + 4)
    }

    if (l == 0 || l == 1) {
        s = 0
    }
    else {
        s = (c / (1 - Math.abs((2 * l) - 1)))
    }

    return { h: h, s: s, l: l }
}

/**
 * Converts color in HSL to RGB.
 * 
 * @param color Color in HSL.
 * @returns Color in RGB.
 */
function HSLtoRGB(colorHSL: HSL): RGB {
    const c: number = (1 - Math.abs((2 * colorHSL.l) - 1)) * colorHSL.s
    const h_: number = colorHSL.h / 60
    const x: number = c * (1 - Math.abs((((h_ % 2) + 2) % 2) - 1)) 
    let R1G1B1: RGB

    if(h_ < 1) {
        R1G1B1 = { r: c, g: x, b: 0 }
    }
    else if(h_ < 2) {
        R1G1B1 = { r: x, g: c, b: 0 }
    }
    else if(h_ < 3) {
        R1G1B1 = { r: 0, g: c, b: x }
    }
    else if(h_ < 4) {
        R1G1B1 = { r: 0, g: x, b: c }
    }
    else if(h_ < 5) {
        R1G1B1 = { r: x, g: 0, b: c }
    }
    else {
        R1G1B1 = { r: c, g: 0, b: x }
    }

    const m: number = colorHSL.l - (c / 2)
    
    return { r: Math.round((R1G1B1.r + m) * 255), g: Math.round((R1G1B1.g + m) * 255), b: Math.round((R1G1B1.b + m) * 255) }
}

/**
 * Takes two colors and adjusts the lightness of one of them until each of the adjusted colors and context color
 * have a contrast ratio greater than 7.
 *
 * @param original Color in RGB that will be adjusted so that the contrast ratio between the adjusted color
 * and the context color is greater than 7.
 * @param context Color in RGB against which the contrast ratio of the adjusted color is calculated.
 * @returns Lightness-adjusted colors in RGB.
 */
function ligAdjustColor(original: RGB, context: RGB): RGB[] {
    // Color does not need to be adjusted since contrast ratio is already >= 7
    if (calculateContrastRGB(original, context) >= 7) {
        return [original]
    }
    else {
        let ligAdjustedColors: RGB[] =  [{ r: -1, g: -1, b: -1 }, { r: -1, g: -1, b: -1 }]// Intializes adjusted color variable
        const originalHSL: HSL = RGBtoHSL(original)
        // Checks if a valid color can be found by increasing lightness by finding the contrast ratio of
        // the original color with max. lightness and context color
        if(calculateContrastRGB(HSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 1 }), context) >= 7) {
            // Finds a valid color by continually incrementing lightness of the original color by 0.01
            for(let i: number = 0.01; i <= 1 - originalHSL.l; i += 0.01) {
                ligAdjustedColors[0] = HSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l + i })
                if (calculateContrastRGB(ligAdjustedColors[0], context) >= 7) {
                    break
                }
            }

            const ligAdjustedHSL = RGBtoHSL(ligAdjustedColors[0])
            if (1 - ligAdjustedHSL.l >= 0.1) {
                ligAdjustedColors[1] = HSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: ligAdjustedHSL.l + 0.1})
            }
            else {
                ligAdjustedColors[1] = HSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: 1})
            }

            if (ligAdjustedColors[0].r == ligAdjustedColors[1].r && ligAdjustedColors[0].g == ligAdjustedColors[1].g && ligAdjustedColors[0].b == ligAdjustedColors[1].b) {
                ligAdjustedColors.pop()
            }

            return ligAdjustedColors
        }
        // Checks if a valid color can be found by decreasing lightness by finding the contrast ratio of
        // the original color with min. lightness and context color
        else if(calculateContrastRGB(HSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 0 }), context) >= 7) {
            // Finds a valid color by continually decrementing lightness of the original color by 0.01
            for(let i: number = 0.01; i <= originalHSL.l; i += 0.01) {
                ligAdjustedColors[0] = HSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l - i })
                if (calculateContrastRGB(ligAdjustedColors[0], context) >= 7) {
                    break
                }
            }

            const ligAdjustedHSL = RGBtoHSL(ligAdjustedColors[0])
            if (ligAdjustedHSL.l >= 0.1) {
                ligAdjustedColors[1] = HSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: ligAdjustedHSL.l - 0.1})
            }
            else {
                ligAdjustedColors[1] = HSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: 0})
            }

            if (ligAdjustedColors[0].r == ligAdjustedColors[1].r && ligAdjustedColors[0].g == ligAdjustedColors[1].g && ligAdjustedColors[0].b == ligAdjustedColors[1].b) {
                ligAdjustedColors.pop()
            }

            return ligAdjustedColors
        }
        else {
            return ligAdjustedColors
        }
    }
}

/**
 *Takes two colors and adjusts the hue of one of them until each of the adjusted colors and context color
 * have a contrast ratio greater than 7.
 *
 * @param original Color in RGB that will be adjusted so that the contrast ratio between each of the adjusted
 * colors and the context color is greater than 7.
 * @param context Color in RGB against which the contrast ratio of the adjusted colors is calculated.
 * @returns Hue-adjusted colors in RGB. 
 */
function hueAdjustColor(original: RGB, context: RGB): RGB[] {
    const hueAdjustedColors: RGB[] = []

    const originalHSL = RGBtoHSL(original)
    // If lightness of color is 0, then it is black and it cannot be hue-adjusted
    if (originalHSL.l == 0) {
        originalHSL.l = 0.01
    }

    if (originalHSL.l == 1) {
        originalHSL.l = 0.09
    }

    if (originalHSL.s == 0) {
        originalHSL.s = 0.25
    }

    let hueAdjusted: RGB
    for(let i = 1; i < 4; i++) {
        // Hue-adjustment is done by increasing hue by (360 / n) mod 360 to get max. hue difference
        hueAdjusted = ligAdjustColor(HSLtoRGB({ h: (((originalHSL.h + (90 * i)) % 360) + 360) % 360, s: originalHSL.s, l: originalHSL.l}), context)[0]
        hueAdjustedColors.push(hueAdjusted)
    }

    return hueAdjustedColors
}

export function findRecoms(originalHex: string, contextHex: string): Color[] {
    const original = hexToRGB(originalHex)
    const context = hexToRGB(contextHex)

    const ligAdjustedColors = ligAdjustColor(original, context)
    const hueAdjustedColors = hueAdjustColor(original, context)
    const recomsRGB = ligAdjustedColors.concat(hueAdjustedColors)

    for(let i = 0; i < recomsRGB.length; i++) {
        for(let j = i + 1; j < recomsRGB.length; j++) {
            if (recomsRGB[i].r == recomsRGB[j].r && recomsRGB[i].g == recomsRGB[j].g && recomsRGB[i].b == recomsRGB[j].b) {
                recomsRGB.splice(j, j)
            }
        }
    }

    const recoms: Color[] = []

    for(const recomRGB of recomsRGB) {
        if (recomRGB.r != -1 && recomRGB.g != -1 && recomRGB.b != -1) {
            recoms.push({ type: "solid", hexString: RGBToHex(recomRGB) })
        }
    }

    return recoms
}