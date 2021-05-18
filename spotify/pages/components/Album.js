import { useState, useEffect } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { capital } from '../../utils/capital'

const Album = ({ getSingleAlbum, getSingleArtist, item, dispatch, location }) => {

    useEffect(() => {
        if( item && item.images && item.artists && !item.main_artist){
            document.documentElement.style.setProperty('--albumBackground', `url(${whichPicture(item.images, 'lrg')})`)  
            getSingleArtist( item.artists[0].id , true )
        } 
    }, [ item ])

    useEffect(() => {

    }, [])

    const handleViewArtist = () => {
        console.log(item.artists)
        if(item.artists.length === 1) {
            let payload = [ ...item.artists ]
            payload['route'] = 'current_selection'
            dispatch( payload )
        }
    }

    return(
        <div className='page page--album album'>
            {item &&
            <header className='album__header'>
                {
                    item.images && 
                    <div className='album__imgContainer'>
                        <img src={ whichPicture(item.images, 'med') } />
                    </div> 
                }
                <h1> { item.name } </h1>
                {
                    item.artists && item.main_artist &&
                    <div className='album__artist'>
                        <img
                        height='48px'
                        width='48px' 
                        src={ whichPicture(item.main_artist.images, 'sm' ) } 
                        alt='Artist' />
                        <p onClick={ handleViewArtist }>{ item.artists.map((artist, i) =>  i !== item.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }` ) }</p>
                    </div>
                }
                <div className='album__meta'>
                    <span> { capital(item.album_type)} </span>
                    | |
                    <span> { item.release_date }</span> 
                </div>
                    
           </header>          
            }
            <h3>Test</h3>
        </div>
    )
}

export default Album