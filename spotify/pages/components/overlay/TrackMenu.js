import Image from 'next/image'
import { whichPicture } from '../../../utils/whichPicture'
import { useState, useEffect, useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const TrackMenu = ({ overlay, setOverlay, setActiveHomeItem }) => {

    const { playNextQueue, setPlayNextQueue, queue, setQueue, qIndex } = useContext( DbHookContext )



    // FUNC 1 IS A CALLBACK SENT FROM TRACK 
    const { type, pageType, data, func, func2 } = { ...overlay}
    const { selectedTrack, calledFrom, collection } = {...data}
    const [ track, setTrack ] = useState( track => track = selectedTrack )
    const copyToClip = () => {
        console.log(track)
        // ILL BE BACK FOR THIS ONCE I FIGURE IF I WANNA SHARE ON SPOTIFY OR MY APP
    }

    const openSpotify = ( e , url ) => {
        e.stopPropagation()
        window.open( url )
    }


    const handleViewArtist = ( e, pageType, artistArray, overlayFunc, activeItemFunc ) => {
        e.stopPropagation()
    
        if( artistArray.length === 1 ){
            activeItemFunc( artistArray[0] )
            overlayFunc( {} )
    
        } else {
            const popupData = {
                title: 'Choose artist',
                array: artistArray
            }
            overlayFunc({ type: 'listMenu' , pageType: pageType, data: popupData, func: func })
        }
    }

    const viewArtist = ( e, artists ) => {
        e.stopPropagation()
        setOverlay( {} )
        handleViewArtist( e , pageType, artists, setOverlay, func)
        if( func2 ) func2()
    }

    const viewAlbum = ( e, album ) => {
        e.stopPropagation()
        setOverlay({})
        setActiveHomeItem( album )
        if( func2 ) func2()
    }

    const handleAddToQueue = () => {
        let trackClone = { ...track }
        trackClone['context'] = {
            name: 'Now playing',
            href: trackClone.href,
            type: 'track'

        }
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, trackClone ])
        setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), trackClone, ...queue.slice(qIndex + 1) ]) 
    }

    return(
        <div className='popup__trackMenu'>
            <header className='popup__header'>
                <div className='popup__imgContainer'>
                    <img
                    src={ whichPicture( track.images, 'med' )}
                    alt='Track art' 
                    />
                </div>
                <h5> 
                    { track.name }
                </h5>
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
               calledFrom !== 'artist' &&
               <button onClick={ (e) => viewArtist( e, track.artists ) } >
                    <i className="far fa-eye"></i>
                    <span> View artist </span> 
                </button>
            }
            {
                calledFrom === 'collection' && 
                collection.album_type === 'playlist' ||
                calledFrom !== 'collection' &&
                <button onClick={ (e) => viewAlbum( e, track.album )}>
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
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
        </div>
    )
} 

export default TrackMenu