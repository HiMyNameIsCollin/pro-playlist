import { useState, useLayoutEffect, useEffect, useContext, useRef } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { PlayerHookContext } from './player/Player'
import { handleColorThief } from '../../utils/handleColorThief'

const Track = ({ type, trackIndex, collectionType , track, handleTrackMenu, trackMounted, setTrackMounted, data }) => {
    const [ activeTrack, setActiveTrack ] = useState(false)
    
    const { queue, setQueue, activeItem, audioRef, qIndex, setQIndex } = useContext( DbHookContext )
    const playerContext = useContext( type === 'playerCollapsed' ? PlayerHookContext : '' )
    
    const isPlaying = playerContext ?  playerContext.isPlaying : null
    const setIsPlaying = playerContext ? playerContext.setIsPlaying: null
    const trackProgressIntervalRef = playerContext ? playerContext.trackProgressIntervalRef : null
    const setTrackProgress = playerContext ? playerContext.setTrackProgress : null
    const setPlayerSize = playerContext ? playerContext.setPlayerSize : null
    const currPlaying = playerContext ? playerContext.currPlaying : null




    useEffect(() => {
        if( queue[ qIndex ] && queue[ qIndex ].id === track.id && type !=='playerCollapsed' && type !== 'queueView'){
            setActiveTrack( true )
        }else {
            setActiveTrack( false )
        }
    },[ qIndex, queue ])


    const playTrack = (e, track ) =>{
        e.stopPropagation()
        // Adds track to Queue. Callback func is 'setQueue'
        if( type === 'search' ){
            
        }else if ( type === 'artist' ){
            
            let nextTracks = data.tracks.map( (t) => {
                t['context'] = {
                    href: data.artist.href,
                    name: data.artist.name,
                    type: 'artist'
                }
                return t
            })         
            const index = data.tracks.findIndex( x => x.id === track.id )
            setQueue( nextTracks )
            setQIndex( index )            
        } else if ( type === 'collection' ){
            let nextTracks = data.tracks.slice( index ).map( (t) => {
                t['context'] = {
                    href: data.collection.href,
                    name: data.collection.name,
                    type : data.collection.type
                }
                return t
            })
            const index = data.tracks.findIndex( x => x.id === track.id )
            setQueue( nextTracks )
            setQIndex( qIndex => qIndex = index )

        }
        
    }
    
    const togglePlayer = () => {
        setPlayerSize('large')
    }

    useEffect(() => {
        if(type === 'playerCollapsed'){
            audioRef.current.pause()
            setIsPlaying( false )
            audioRef.current.src = track.preview_url 
            audioRef.current.load()
            if( trackMounted ) {
                audioRef.current.oncanplaythrough = () => setIsPlaying( true )
                
            }    
            return () => {
                setIsPlaying( false )
                clearInterval(trackProgressIntervalRef.current)
                setTrackProgress(0)
            }
        }
    }, [ currPlaying ])

    const trackLoaded = (e, amount) => {
        if(type === 'playerCollapsed'){
            const colors = handleColorThief(e.target, amount)
            colors.map((clr, i) => document.documentElement.style.setProperty(`--currentTrackColor${i}`, clr))
            setTrackMounted( true )
        }
    }

    return(
        <div 
        onClick={ (e) => type == 'playerCollapsed' ? togglePlayer() : 
        type === 'queueView' ?
        null :
        playTrack(e, track )  }
        // onTouchStart={ (e) => type !== 'playerCollapsed' ? playTrack(e, track, queue, setQueue) : console.log(track) }
        className={
            `track 
            track--${ collectionType ? collectionType : type }
            ${ activeTrack && 'track--active' }`
        }
        data-trackId={ track.id }>
        {/* Ternary operators determine if this is a playlist or an album. */}

        {
            type === 'artist' &&
            <p> { trackIndex + 1 } </p> 
        }

        {
            type === 'collection' && collectionType === 'playlist' &&
            <div className='track__imgContainer'>
                <img
                crossorigin='anonymous'
                onLoad={ (e) => trackLoaded(e, 2) }
                alt='Album' 
                src={ whichPicture( track.album.images, 'sm') }/>
            </div>
        }
        {
            type !== 'collection' && !collectionType &&
            <div className='track__imgContainer'>
                <img
                crossorigin='anonymous'
                onLoad={ (e) => trackLoaded(e, 2) }
                alt='Album' 
                src={ whichPicture( track.album.images, 'sm') }/>
            </div>
        }
        
            <h5>
                { track.name }
            </h5>
            <span>
                {
                    track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)
                }
            </span>
            {
                type !== 'playerCollapsed' && type !== 'queueView' &&
                <i className="fas fa-heart track__likeBtn"></i>

            }
            
            {
                type !== 'playerCollapsed' &&
                <i className="fas fa-ellipsis-h track__menuBtn"
                onClick={ (e) => handleTrackMenu(e, track ) }></i> 
            }

        </div>
    )
}

export default Track