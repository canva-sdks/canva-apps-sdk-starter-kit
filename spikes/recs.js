function withinRange(colorLinear, adjust) {
    return (colorLinear.r * adjust <= 1 && colorLinear.g * adjust <= 1 && colorLinear.b * adjust <= 1
        && colorLinear.r * adjust >= 0 && colorLinear.g * adjust >= 0 && colorLinear.b * adjust >= 0);
}
function convertRGBToLinearRGB(color) {
    var redsRGB = color.r / 255;
    var greensRGB = color.g / 255;
    var blueSRGB = color.b / 255;
    var redLinear = ((redsRGB <= 0.03928) ? redsRGB / 12.92 : Math.pow(((redsRGB + 0.055) / 1.055), 2.4));
    var greenLinear = ((greensRGB <= 0.03928) ? greensRGB / 12.92 : Math.pow(((greensRGB + 0.055) / 1.055), 2.4));
    var blueLinear = ((blueSRGB <= 0.03928) ? blueSRGB / 12.92 : Math.pow(((blueSRGB + 0.055) / 1.055), 2.4));
    return { r: redLinear, g: greenLinear, b: blueLinear };
}
function convertLinearRGBToRGB(colorLinear) {
    var redsRGB = ((colorLinear.r <= 491 / 161500) ? colorLinear.r * 12.92 : ((Math.pow(colorLinear.r, (1 / 2.4))) * 1.055) - 0.055);
    var greensRGB = ((colorLinear.g <= 491 / 161500) ? colorLinear.g * 12.92 : ((Math.pow(colorLinear.g, (1 / 2.4))) * 1.055) - 0.055);
    var blueSRGB = ((colorLinear.b <= 491 / 161500) ? colorLinear.b * 12.92 : ((Math.pow(colorLinear.b, (1 / 2.4))) * 1.055) - 0.055);
    var red = redsRGB * 255;
    var green = greensRGB * 255;
    var blue = blueSRGB * 255;
    return { r: Math.round(red), g: Math.round(green), b: Math.round(blue) };
}
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
        h = 60 * (((g - b) / c) % 6);
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
function convertHSLtoRGB(colorHSL) {
    var c = (1 - Math.abs((2 * colorHSL.l) - 1)) * colorHSL.s;
    var h_ = colorHSL.h / 60;
    var x = c * (1 - Math.abs((h_ % 2) - 1));
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
function findRelativeLuminance(color) {
    var colorLinear = convertRGBToLinearRGB(color);
    var lum = 0.2126 * colorLinear.r + 0.7152 * colorLinear.g + 0.0722 * colorLinear.b;
    return lum;
}
function findContrastRatio(fg, bg) {
    var lum1 = findRelativeLuminance(fg);
    var lum2 = findRelativeLuminance(bg);
    var ratio = (lum1 + 0.05) / (lum2 + 0.05);
    if (ratio < 1) {
        ratio = 1 / ratio;
    }
    return ratio;
}
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
function findBetterColor(original, context) {
    if (findContrastRatio(original, context) >= 7) {
        return original;
    }
    else {
        var lumOriginal = findRelativeLuminance(original);
        var lumContext = findRelativeLuminance(context);
        var numAdjust = ((7 * lumContext) + 0.3) / lumOriginal;
        var denomAdjust = (lumContext - 0.3) / (7 * lumOriginal); //Must ensure lumOrginal > 0
        var originalLinear = convertRGBToLinearRGB(original);
        var adjusted = original;
        if (lumOriginal * numAdjust > lumContext && withinRange(originalLinear, numAdjust)) {
            console.log("Case 1");
            adjusted = convertLinearRGBToRGB({ r: originalLinear.r * numAdjust, g: originalLinear.g * numAdjust, b: originalLinear.b * numAdjust });
        }
        else if (lumContext > lumOriginal * denomAdjust && withinRange(originalLinear, denomAdjust)) {
            console.log("Case 2");
            adjusted = convertLinearRGBToRGB({ r: originalLinear.r * denomAdjust, g: originalLinear.g * denomAdjust, b: originalLinear.b * denomAdjust });
        }
        else {
            console.log("Failed");
        }
        return adjusted;
    }
}
function findBetterColorBackup(original, context) {
    if (findContrastRatio(original, context) >= 7) {
        return original;
    }
    else {
        var adjusted = original;
        var originalHSL = convertRGBtoHSL(original);
        if (findContrastRatio(convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 1 }), context) >= 7) {
            console.log("Case 1");
            for (var i = 0.01; i <= 1 - originalHSL.l; i += 0.01) {
                adjusted = convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l + i });
                if (findContrastRatio(adjusted, context) >= 7) {
                    break;
                }
            }
            return adjusted;
        }
        else if (findContrastRatio(convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: 0 }), context) >= 7) {
            console.log("Case 2");
            for (var i = 0.01; i <= originalHSL.l; i += 0.01) {
                adjusted = convertHSLtoRGB({ h: originalHSL.h, s: originalHSL.s, l: originalHSL.l - i });
                if (findContrastRatio(adjusted, context) >= 7) {
                    break;
                }
            }
            return adjusted;
        }
        else {
            console.log("Failed");
            return original;
        }
    }
}
var fg = { r: Math.round(Math.random() * 255), g: Math.round(Math.random() * 255), b: Math.round(Math.random() * 255) };
var bg = { r: Math.round(Math.random() * 255), g: Math.round(Math.random() * 255), b: Math.round(Math.random() * 255) };
// const fg: RGB = { r: 16, g: 94, b: 139 }
// const bg: RGB = { r: 26, g: 65, b: 14 }
var fgLinear = convertRGBToLinearRGB(fg);
var fgHSL = convertRGBtoHSL(fg);
console.log("Original Colors: ", fg, bg);
console.log("Contrast Ratio:", findContrastRatio(fg, bg));
// console.log("FG Lum.: ", findRelativeLuminance(fg))
// console.log("BG Lum.: ", findRelativeLuminance(bg))
// console.log(runContrastTests(fg, bg))
// console.log(fgLinear)
// console.log(fgHSL)
// console.log(convertHSLtoRGB(fgHSL))
console.log("Adjusted Colors: ", findBetterColorBackup(fg, bg), bg);
console.log("Contrast Ratio: ", findContrastRatio(findBetterColorBackup(fg, bg), bg));
