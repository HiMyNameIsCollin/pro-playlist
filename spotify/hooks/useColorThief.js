import ColorThief from '../node_modules/colorthief/dist/color-thief.mjs'

const useColorThief = ( callback, className ) => {
    const colorThief = new ColorThief()
    const handleColorThief = (e, total) => {

        const palette = colorThief.getPalette(e.target , 2)
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
          }).join('')
        console.log(palette)
        const colors = palette.map((clrArray) => {
            return rgbToHex(...clrArray)
        })
        colors.map((clr, i) => document.documentElement.style.setProperty(`--${className}${i}`, clr) )
        callback(true)
    }

    return { handleColorThief }
}

export default useColorThief