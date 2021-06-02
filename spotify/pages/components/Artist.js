import { useState, useEffect } from 'react'

const Artist = ({ item, setActiveItem, setActiveHeader, overlay, setOverlay, headerMounted, genreSeeds, location }) => {
    return(
        <div className={ `page page--artist artist ${ overlay ? 'page--blurred' : ''}` }>
            Test
        </div>
    )
}

export default Artist