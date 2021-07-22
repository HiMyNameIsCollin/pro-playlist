import Image from 'next/image'
import { animated } from 'react-spring'
import { whichPicture } from '../../../utils/whichPicture'
import { useState, useEffect, useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const TrackMenu = ({ setActiveItem, transition, calledFrom, page, type, track }) => {

    const { overlay, setOverlay, setPlayNextQueue } = useContext( DbHookContext )
    

    const copyToClip = () => {
        console.log(track)
        // ILL BE BACK FOR THIS ONCE I FIGURE IF I WANNA SHARE ON SPOTIFY OR MY APP
    }

    const openSpotify = ( e , url ) => {
        e.stopPropagation()
        window.open( url )
    }

    const viewArtist = (e) => {
        e.stopPropagation()
        if( track.artists.length === 1 ){
            if( page === 'home' || page==='manage' || calledFrom==='player' ) setActiveItem( track.artists[0] )
            if( page === 'search' ) setActiveItem( track.artists[0] )
        } else {
            let oClone = { ...overlay}
            oClone.data = { artists: track.artists }
            setOverlay( oClone )
        }
       
    }

    const viewAlbum = ( e ) => {
        e.stopPropagation()
        setActiveItem( track.album )
    }

    const handleAddToQueue = () => {
        let trackClone = { ...track }
        trackClone['context'] = {
            name: 'Now playing',
            href: trackClone.href,
            type: 'track'

        }
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, trackClone ])
    }

    return(
        <animated.div 
        style={ transition }
        className='trackMenu overlay__popup'>
            <header className='trackMenu__header'>
                <div className='trackMenu__imgContainer'>
                    <img
                    src={ whichPicture( track.images, 'med' )}
                    alt='Track art' 
                    />
                </div>
                <h3> 
                    { track.name }
                </h3>
                <p> { track.artists[0].name } </p>
            </header>
            <button onClick={ (e) => openSpotify(e, track.external_urls.spotify )} >
                <Image 
                src='/Spotify_Icon_RGB_Green.png'
                alt='View via Spotify' 
                height='32px'
                width='32px'/>
                <span> View via Spotify </span>
            </button>
            <button onClick={ () => copyToClip( track ) }>
                <i className="fas fa-share-alt"></i> 
                <span> Share </span>
            </button>
       
            {
            type !== 'artist' &&
            <button onClick={ viewArtist } >
                <i className="far fa-eye"></i>
                <span> View artist </span> 
            </button>
            }
        
            {
            track.album && 
            <button onClick={ viewAlbum }>
                <i className="far fa-eye"></i>
                <span> View album </span>
            </button>
            }
            
            <button onClick={ handleAddToQueue }>
                <i className="far fa-plus-square"></i>
                <span> Add to queue </span>
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
        </animated.div>
    )
} 

export default TrackMenu