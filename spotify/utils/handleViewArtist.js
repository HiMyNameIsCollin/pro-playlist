
export const handleViewArtist = ( e, artistArray, overlayFunc, activeItemFunc ) => {
    e.stopPropagation()
    if( artistArray.length === 1 ){
        activeItemFunc( artistArray[0] )
        overlayFunc( null )
    } else {
        const popupData = {
            title: 'Choose artist',
            array: artistArray
        }
        overlayFunc({ type: 'listMenu' , data: popupData, func: activeItemFunc })
    }
}