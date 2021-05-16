import { useState, useEffect } from 'react'

const Album = ({ active, setActive, getSingleAlbum, location }) => {

    useEffect(() => {
        if(active){

        } else{
            getSingleAlbum( location.pathname.substring(7) )
        }
    }, [])

    return(
        <div className='page page--bg'>

        </div>
    )
}

export default Album