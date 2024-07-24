// function withinRange(colorLinear: RGB, adjust: number) {
//     return (colorLinear.r * adjust <= 1 && colorLinear.g * adjust <= 1 && colorLinear.b * adjust <= 1 
//         && colorLinear.r * adjust >= 0 && colorLinear.g * adjust >= 0 && colorLinear.b * adjust >= 0)
// }
/**
 * Converts color in RGB to linear RGB.
 *
 * @param color Color in RGB.
 * @returns Color in Linear RGB.
 */
function convertRGBToLinearRGB(color) {
    var redsRGB = color.r / 255;
    var greensRGB = color.g / 255;
    var blueSRGB = color.b / 255;
    var redLinear = ((redsRGB <= 0.03928) ? redsRGB / 12.92 : Math.pow(((redsRGB + 0.055) / 1.055), 2.4));
    var greenLinear = ((greensRGB <= 0.03928) ? greensRGB / 12.92 : Math.pow(((greensRGB + 0.055) / 1.055), 2.4));
    var blueLinear = ((blueSRGB <= 0.03928) ? blueSRGB / 12.92 : Math.pow(((blueSRGB + 0.055) / 1.055), 2.4));
    return { r: redLinear, g: greenLinear, b: blueLinear };
}
/**
 * Converts color in linear RGB to RGB.
 *
 * @param color Color in Linear RGB.
 * @returns Color in RGB.
 */
function convertLinearRGBToRGB(colorLinear) {
    var redsRGB = ((colorLinear.r <= 491 / 161500) ? colorLinear.r * 12.92 : ((Math.pow(colorLinear.r, (1 / 2.4))) * 1.055) - 0.055);
    var greensRGB = ((colorLinear.g <= 491 / 161500) ? colorLinear.g * 12.92 : ((Math.pow(colorLinear.g, (1 / 2.4))) * 1.055) - 0.055);
    var blueSRGB = ((colorLinear.b <= 491 / 161500) ? colorLinear.b * 12.92 : ((Math.pow(colorLinear.b, (1 / 2.4))) * 1.055) - 0.055);
    var red = redsRGB * 255;
    var green = greensRGB * 255;
    var blue = blueSRGB * 255;
    return { r: Math.round(red), g: Math.round(green), b: Math.round(blue) };
}
/**
 * Converts color in RGB to HSL.
 *
 * @param color Color in RGB.
 * @returns Color in HSL.
 */
function convertRGBtoHSL(color) {
    var r = color.r / 255;
    var g = color.g / 255;
    var b = color.b / 255;
    var x_max = Math.max(r, g, b);
    var x_min = Math.min(r, g, b);
    var c = x_max - x_min;
    var l = (x_max + x_min) / 2;
    var h;
    var s;
    if (c == 0) {
        h = 0;
    }
    else if (x_max == r) {
        h = 60 * (((((g - b) / c) % 6) + 6) % 6);
    }
    else if (x_max == g) {
        h = 60 * (((b - r) / c) + 2);
    }
    else {
        h = 60 * (((r - g) / c) + 4);
    }
    if (l == 0 || l == 1) {
        s = 0;
    }
    else {
        s = (c / (1 - Math.abs((2 * l) - 1)));
    }
    return { h: h, s: s, l: l };
}
/**
 * Converts color in HSL to RGB.
 *
 * @param color Color in HSL.
 * @returns Color in RGB.
 */
function convertHSLtoRGB(colorHSL) {
    var c = (1 - Math.abs((2 * colorHSL.l) - 1)) * colorHSL.s;
    var h_ = colorHSL.h / 60;
    var x = c * (1 - Math.abs((((h_ % 2) + 2) % 2) - 1));
    var R1G1B1;
    if (h_ < 1) {
        R1G1B1 = { r: c, g: x, b: 0 };
    }
    else if (h_ < 2) {
        R1G1B1 = { r: x, g: c, b: 0 };
    }
    else if (h_ < 3) {
        R1G1B1 = { r: 0, g: c, b: x };
    }
    else if (h_ < 4) {
        R1G1B1 = { r: 0, g: x, b: c };
    }
    else if (h_ < 5) {
        R1G1B1 = { r: x, g: 0, b: c };
    }
    else {
        R1G1B1 = { r: c, g: 0, b: x };
    }
    var m = colorHSL.l - (c / 2);
    return { r: Math.round((R1G1B1.r + m) * 255), g: Math.round((R1G1B1.g + m) * 255), b: Math.round((R1G1B1.b + m) * 255) };
}
/**
 * Calculates relatie luminance of color.
 *
 * @param color Color in RGB.
 * @returns Relative luminance.
 */
function findRelativeLuminance(color) {
    var colorLinear = convertRGBToLinearRGB(color);
    var lum = 0.2126 * colorLinear.r + 0.7152 * colorLinear.g + 0.0722 * colorLinear.b;
    return lum;
}
/**
 * Calculates contrast ratio of the two colors.
 *
 * @param fg Foreground color in RGB.
 * @param bg Background color in RGB.
 * @returns Contrast ratio.
 */
function findContrastRatio(fg, bg) {
    var lum1 = findRelativeLuminance(fg);
    var lum2 = findRelativeLuminance(bg);
    var ratio = (lum1 + 0.05) / (lum2 + 0.05);
    //Contrast ratio must always be >= 1
    if (ratio < 1) {
        ratio = 1 / ratio;
    }
    return ratio;
}
/**
 * Runs contrast tests on the two colors.
 *
 * @param fg Foreground color in RGB.
 * @param bg Background color in RGB.
 * @returns Test values as a object.
 */
function runContrastTests(fg, bg) {
    var ratio = findContrastRatio(fg, bg);
    var result = {
        NormalAA: false,
        NormalAAA: false,
        LargeAA: false,
        LargeAAA: false
    };
    if (ratio >= 3) {
        result.LargeAA = true;
    }
    if (ratio >= 4.5) {
        result.LargeAAA = true;
        result.NormalAA = true;
    }
    if (ratio >= 7) {
        result.NormalAAA = true;
    }
    return result;
}
// function findBetterColor(original: RGB, context: RGB): RGB {
//     if (findContrastRatio(original, context) >= 7) {
//         return original
//     }
//     else {
//         let lumOriginal = findRelativeLuminance(original)
//         let lumContext = findRelativeLuminance(context)
//         const numAdjust = ((7 * lumContext) + 0.3) / lumOriginal
//         const denomAdjust = (lumContext - 0.3) / (7 * lumOriginal) //Must ensure lumOrginal > 0
//         const originalLinear = convertRGBToLinearRGB(original)
//         let adjusted = original
//         if (lumOriginal * numAdjust > lumContext && withinRange(originalLinear, numAdjust)) {
//             console.log("Case 1")
//             adjusted =  convertLinearRGBToRGB({ r: originalLinear.r * numAdjust, g: originalLinear.g * numAdjust, b: originalLinear.b * numAdjust })
//         }
//         else if (lumContext > lumOriginal * denomAdjust && withinRange(originalLinear, denomAdjust)) {
//             console.log("Case 2")
//             adjusted =  convertLinearRGBToRGB({ r: originalLinear.r * denomAdjust, g: originalLinear.g * denomAdjust, b: originalLinear.b * denomAdjust })
//         }
//         else {
//         console.log("Failed")
//         }
//         return adjusted
//     }
// }
/**
 * Takes two colors and adjusts the lightness of one of them until each of the adjusted colors and context color
 * have a contrast ratio greater than 7.
 *
 * @param original Color in RGB that will be adjusted so that the contrast ratio between the adjusted color
 * and the context color is greater than 7.
 * @param context Color in RGB against which the contrast ratio of the adjusted color is calculated.
 * @returns Lightness-adjusted colors in RGB.
 */
function ligAdjustColor(original, context) {
    // Color does not need to be adjusted since contrast ratio is already >= 7
    if (findContrastRatio(original, context) >= 7) {
        return [original];
    }
    else {
        var ligAdjustedColors = [{ r: -1, g: -1, b: -1 }, { r: -1, g: -1, b: -1 }]; // Intializes adjusted color variable
        var originalHSL = convertRGBtoHSL(original);
        // Checks if a valid color can be found by increasing lightness by finding the contrast ratio of
        // the original color with max. lightness and context color
        if (findContrastRatio(convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 1 }), context) >= 7) {
            console.log("Case 1");
            // Finds a valid color by continually incrementing lightness of the original color by 0.01
            for (var i = 0.01; i <= 1 - originalHSL.l; i += 0.01) {
                ligAdjustedColors[0] = convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l + i });
                if (findContrastRatio(ligAdjustedColors[0], context) >= 7) {
                    break;
                }
            }
            var ligAdjustedHSL = convertRGBtoHSL(ligAdjustedColors[0]);
            if (1 - ligAdjustedHSL.l >= 0.1) {
                ligAdjustedColors[1] = convertHSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: ligAdjustedHSL.l + 0.1 });
            }
            else {
                ligAdjustedColors[1] = convertHSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: 1 });
            }
            if (ligAdjustedColors[0] == ligAdjustedColors[1]) {
                ligAdjustedColors.pop();
            }
            return ligAdjustedColors;
        }
        // Checks if a valid color can be found by decreasing lightness by finding the contrast ratio of
        // the original color with min. lightness and context color
        else if (findContrastRatio(convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 0 }), context) >= 7) {
            console.log("Case 2");
            // Finds a valid color by continually decrementing lightness of the original color by 0.01
            for (var i = 0.01; i <= originalHSL.l; i += 0.01) {
                ligAdjustedColors[0] = convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l - i });
                if (findContrastRatio(ligAdjustedColors[0], context) >= 7) {
                    break;
                }
            }
            var ligAdjustedHSL = convertRGBtoHSL(ligAdjustedColors[0]);
            if (ligAdjustedHSL.l >= 0.1) {
                ligAdjustedColors[1] = convertHSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: ligAdjustedHSL.l - 0.1 });
            }
            else {
                ligAdjustedColors[1] = convertHSLtoRGB({ h: ligAdjustedHSL.h, s: ligAdjustedHSL.s, l: 0 });
            }
            if (ligAdjustedColors[0] == ligAdjustedColors[1]) {
                ligAdjustedColors.pop();
            }
            return ligAdjustedColors;
        }
        else {
            console.log("Failed");
            return ligAdjustedColors;
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
function hueAdjustColor(original, context) {
    var hueAdjustedColors = [];
    var originalHSL = convertRGBtoHSL(original);
    // If lightness of color is 0, then it is black and it cannot be hue-adjusted
    if (originalHSL.l == 0) {
        return hueAdjustedColors;
    }
    var hueAdjusted;
    for (var i = 1; i < 4; i++) {
        // Hue-adjustment is done by increasing hue by (360 / n) mod 360 to get max. hue difference
        hueAdjusted = ligAdjustColor(convertHSLtoRGB({ h: (((originalHSL.h + (90 * i)) % 360) + 360) % 360, s: originalHSL.s, l: originalHSL.l }), context)[0];
        hueAdjustedColors.push(hueAdjusted);
    }
    return hueAdjustedColors;
}
var fg = { r: Math.round(Math.random() * 255), g: Math.round(Math.random() * 255), b: Math.round(Math.random() * 255) };
var bg = { r: Math.round(Math.random() * 255), g: Math.round(Math.random() * 255), b: Math.round(Math.random() * 255) };
// const fg: RGB = { r: 193, g: 16, b: 43 }
// const bg: RGB = { r: 111, g: 173, b: 86 }
// const fgLinear: RGB = convertRGBToLinearRGB(fg)
// const fgHSL: HSL = convertRGBtoHSL(fg)
var betterFGs = ligAdjustColor(fg, bg).concat(hueAdjustColor(fg, bg));
console.log("Original Colors:", fg, bg);
console.log("Contrast Ratio:", findContrastRatio(fg, bg));
// console.log("FG Lum.: ", findRelativeLuminance(fg))
// console.log("BG Lum.: ", findRelativeLuminance(bg))
// console.log(runContrastTests(fg, bg))
// console.log(fgLinear)
// console.log(fgHSL)
// console.log(convertHSLtoRGB(fgHSL))
// console.log("Adjusted Colors:", findBetterColor(fg, bg), bg)
for (var i = 0; i < betterFGs.length; i++) {
    console.log("Adjusted Colors:", betterFGs[i], bg);
    console.log("Contrast Ratio:", findContrastRatio(betterFGs[i], bg));
}
