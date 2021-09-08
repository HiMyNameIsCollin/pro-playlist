import Image from 'next/image'
import { animated } from 'react-spring'
import { whichPicture } from '../../../utils/whichPicture'
import { useState, useEffect, useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const TrackMenu = ({ setActiveItem, transition, calledFrom, page, type, track }) => {

    const { overlay, setOverlay, setPlayNextQueue, toBeManaged, setToBeManaged, setMessageOverlay, setSelectOverlay, playerSize, setPlayerSize } = useContext( DbHookContext )

    const openSpotify = ( e , url ) => {
        e.stopPropagation()
        window.open( url )
    }

    const viewArtist = (e) => {
        e.stopPropagation()
        let delay = 250
        if( playerSize === 'large' ) {
            setPlayerSize('small')
            delay = 500
        }
        if( track.artists.length === 1 ){
            setOverlay( {} )
            setTimeout(() => setActiveItem( track.artists[0] ) , delay )
        } else {
            let oClone = { ...overlay}
            oClone.data = { artists: track.artists }
            setOverlay( oClone )
        }
       
    }

    const viewAlbum = ( e ) => {
        e.stopPropagation()
        setOverlay( {} )
        let delay = 250
        if( playerSize === 'large' ) {
            setPlayerSize('small')
            delay = 500
        }
        setTimeout(() => setActiveItem( track.album ), delay)
    }

    const handleAddToQueue = () => {
        setMessageOverlay( message => message = [ ...message, `${track.name} added to queue`] )
        let trackClone = { ...track }
        trackClone['context'] = {
            name: 'Now playing',
            href: trackClone.href,
            type: 'track'

        }
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, trackClone ])
    }

    const handleAddToManager = () => {
        setMessageOverlay( message => message = [ ...message, `${track.name} added to manager`] )
        setOverlay( {} )
        setToBeManaged( track ) 
    }

    const handleAddToPlaylist = (e) => {
        e.stopPropagation()
        if( playerSize === 'large' ) setPlayerSize('small')
        const overlay = { type:'playlists', page: 'home', data: [track] }
        setOverlay( {} )
        setTimeout(() => setSelectOverlay( arr => arr = [ ...arr, overlay ] ), 500 )     
    }

    return(
        <animated.div 
        style={ transition }
        className='trackMenu overlay__popup'>
            <header className='trackMenu__header' >
                <div className='trackMenu__imgContainer'>
                    <img
                    src={ whichPicture( track.images, `${ window.innerWidth >= 768 ? 'lrg' : 'med' }` )}
                    alt='Track art' 
                    />
                </div>
                <p className='trackMenu__title'> 
                    { track.name }
                </p>
                <p className='trackMenu__info'> { track.artists[0].name } </p>
            </header>
            <button onClick={ (e) => openSpotify(e, track.external_urls.spotify )} >
                <Image 
                src='/Spotify_Icon_RGB_Green.png'
                alt='View via Spotify' 
                height='32px'
                width='32px'/>
                <span> View via Spotify </span>
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
                <i className="fas fa-record-vinyl"></i>
                <span> View album </span>
            </button>
            }
            
            <button onClick={ handleAddToQueue }>
                <i className="fas fa-plus-square"></i>
                <span> Add to queue </span>
            </button>
            <button onClick={ handleAddToManager }>
                <i className="fas fa-folder-plus"></i>
                <span>Add track to Manager</span>
            </button>
            <button onClick={ handleAddToPlaylist }>
                <i className="fas fa-plus-circle"></i>
                <span>Add track to playlist</span>
            </button>

        </animated.div>
    )
} 

export default TrackMenu