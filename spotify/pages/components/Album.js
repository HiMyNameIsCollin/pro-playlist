import { useState, useEffect } from 'react'
import { whichPicture } from '../../utils/whichPicture'

const Album = ({ active, setActive, getSingleAlbum, getSingleArtist, location }) => {

    useEffect(() => {
        if( !active ) getSingleAlbum( location.pathname.substring(7) )
    }, [])

    useEffect(() => {
        if( active && active.images && active.artists){
            document.documentElement.style.setProperty('--albumBackground', `url(${whichPicture(active.images, 'lrg')})`)  
            getSingleArtist( active.artists[0].id )
        } 
    }, [active])

    return(
        <div className='page page--album album'>
            {active &&
            <header className='album__header'>
                {
                    active.images && 
                    <div className='album__imgContainer'>
                        <img src={ whichPicture(active.images, 'med') } />
                    </div> 
                }
                <h1> { active.name } </h1>
                {
                    active.artists && active.main_artist &&
                    <div className='album__meta'>
                        <img
                        height='48px'
                        width='48px' 
                        src={ whichPicture(active.main_artist.images, 'sm' ) } 
                        alt='Artist' />
                        <p>{ active.artists.map((artist, i) =>  i !== active.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }` ) }</p>
                        <p>  </p>
                    </div>
                }

           </header>          
            }
        </div>
    )
}

export default Album