import ColorThief from '../node_modules/colorthief/dist/color-thief.mjs'


export const handleColorThief = (img, total) => {
    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(img , total)
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
        }).join('')
    const colors = palette.map((clrArray) => {
        return rgbToHex(...clrArray)
    })
    return colors
}

