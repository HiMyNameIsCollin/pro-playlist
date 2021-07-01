
export const handleViewArtist = ( e, pageType, artistArray, overlayFunc, activeItemFunc ) => {
    e.stopPropagation()

    if( artistArray.length === 1 ){
        activeItemFunc( artistArray[0] )
        overlayFunc( {} )

    } else {
        const popupData = {
            title: 'Choose artist',
            array: artistArray
        }
        overlayFunc({ type: 'listMenu' , pageType: pageType, data: popupData, func: activeItemFunc })
    }
}