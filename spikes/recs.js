function findRelativeLuminance(color) {
    var redSRGB = color.r / 255;
    var greenSRGB = color.g / 255;
    var blueSRGB = color.b / 255;
    var red = ((redSRGB <= 0.03928) ? redSRGB / 12.92 : Math.pow(((redSRGB + 0.055) / 1.055), 2.4));
    var green = ((greenSRGB <= 0.03928) ? greenSRGB / 12.92 : Math.pow(((greenSRGB + 0.055) / 1.055), 2.4));
    var blue = ((blueSRGB <= 0.03928) ? blueSRGB / 12.92 : Math.pow(((blueSRGB + 0.055) / 1.055), 2.4));
    var lum = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
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
console.log(findContrastRatio({ r: 255, g: 255, b: 255 }, { r: 51, g: 35, b: 35 }));
console.log(runContrastTests({ r: 255, g: 255, b: 255 }, { r: 51, g: 35, b: 35 }));
