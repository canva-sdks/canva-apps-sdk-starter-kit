type RGB = {
    r: number
    g: number
    b: number
}

type Result = {
    NormalAA: boolean,
    NormalAAA: boolean,
    LargeAA: boolean,
    LargeAAA: boolean
}

function findRelativeLuminance(color: RGB) {
    const redSRGB: number = color.r/255
    const greenSRGB: number = color.g/255
    const blueSRGB: number = color.b/255

    const red: number = ((redSRGB <= 0.03928) ? redSRGB/12.92 : ((redSRGB +0.055)/1.055) ** 2.4)
    const green: number = ((greenSRGB <= 0.03928) ? greenSRGB/12.92 : ((greenSRGB +0.055)/1.055) ** 2.4)
    const blue: number = ((blueSRGB <= 0.03928) ? blueSRGB/12.92 : ((blueSRGB +0.055)/1.055) ** 2.4)

    const lum: number = 0.2126 * red + 0.7152 * green + 0.0722 * blue

    return lum
}

function findContrastRatio(fg: RGB, bg: RGB): number {
    const lum1: number = findRelativeLuminance(fg)
    const lum2: number = findRelativeLuminance(bg)

    let ratio: number = (lum1 + 0.05) / (lum2 + 0.05)
    if (ratio < 1) {
        ratio = 1/ratio
    }

    return ratio
}

function runContrastTests(fg: RGB, bg: RGB) {
    const ratio: number = findContrastRatio(fg, bg)
    let result: Result = {
        NormalAA: false,
        NormalAAA: false,
        LargeAA: false,
        LargeAAA: false
    }

    if (ratio >= 3) {
        result.LargeAA = true
    }
    if (ratio >= 4.5) {
        result.LargeAAA = true
        result.NormalAA = true
    }
    if (ratio >= 7) {
        result.NormalAAA = true
    }

    return result
}



console.log(findContrastRatio({ r: 255, g: 255, b: 255 }, { r: 51, g: 35, b: 35 }))
console.log(runContrastTests({ r: 255, g: 255, b: 255 }, { r: 51, g: 35, b: 35 }))