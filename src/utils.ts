type linearRGB = {
    r: number
    g: number
    b: number
}

export const calculateContrast = (fgColour: string, bgColour: string): number => {
    
    const hexToRGB = (hex: string): linearRGB => {

        // convering hex to RGB
        const bigint = parseInt(hex.substring(1), 16);
        const redsRGB = ((bigint >> 16) & 255)/255;
        const greensRGB = ((bigint >> 8) & 255)/255;
        const blueSRGB = (bigint & 255)/255;
        
        // converting to linear RGB
        const redLinear: number = ((redsRGB <= 0.03928) ? redsRGB/12.92 : ((redsRGB +0.055)/1.055) ** 2.4)
        const greenLinear: number = ((greensRGB <= 0.03928) ? greensRGB/12.92 : ((greensRGB +0.055)/1.055) ** 2.4)
        const blueLinear: number = ((blueSRGB <= 0.03928) ? blueSRGB/12.92 : ((blueSRGB +0.055)/1.055) ** 2.4)
        
        return { r: redLinear, g: greenLinear, b: blueLinear };
    };

    const findRelativeLuminance = (colour: linearRGB): number => {
        const lum: number = 0.2126 * colour.r + 0.7152 * colour.g + 0.0722 * colour.b
    
        return lum
    }
    
    const fgLinearRGB = hexToRGB(fgColour);
    const bgLinearRGB = hexToRGB(bgColour);
    const lumFG = findRelativeLuminance(fgLinearRGB);
    const lumBG = findRelativeLuminance(bgLinearRGB);
    
    let contrastRatio: number = (lumFG + 0.05) / (lumBG + 0.05)
    // Contrast ratio must always be >= 1
    if (contrastRatio < 1) {
        contrastRatio = 1/contrastRatio
    }

    return contrastRatio;
  };

export const scorePass = (contrastScore: number): boolean => {
    return contrastScore >= 7;
};