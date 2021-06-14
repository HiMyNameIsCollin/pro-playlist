import { useState, useLayoutEffect, useEffect, useContext, useRef } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { PlayerHookContext } from './Player'

const Track = ({ type, i , track, handleTrackMenu, trackMounted, setTrackMounted, data }) => {
    const [ activeTrack, setActiveTrack ] = useState(false)
    
    const { queue, setQueue, activeItem, audioRef } = useContext( DbHookContext )
    const playerContext = useContext( type === 'player--collapsed' ? PlayerHookContext : '' )
    
    const isPlaying = playerContext ?  playerContext.isPlaying : null
    const setIsPlaying = playerContext ? playerContext.setIsPlaying: null
    const trackProgressIntervalRef = playerContext ? playerContext.trackProgressIntervalRef : null
    const setTrackProgress = playerContext ? playerContext.setTrackProgress : null
    useLayoutEffect(() => {
        if( queue[0] && queue[0].id === track.id && type !=='player--collapsed' ){
            setActiveTrack( true )
        }else {
            setActiveTrack( false )
        }
    },[ queue ])

    const playTrack = (e, track ) =>{
        e.stopPropagation()
        // Adds track to Queue. Callback func is 'setQueue'
        if(queue[0] && queue[0].id !== track.id) {
            if( type === 'search' ){

            }else{
            const index = data.tracks.findIndex( x => x.id === track.id )
            setQueue( [ ...data.tracks.slice(index) ] )
            }
        }
    }

    useEffect(() => {
        if(type === 'player--collapsed'){
            audioRef.current.pause()
            setIsPlaying( false )
            audioRef.current.src = track.preview_url 
            audioRef.current.load()
            if( trackMounted ) {
                if( !queue[0].noPlay ){
                    audioRef.current.oncanplaythrough = () => setIsPlaying( true )
                }
            }    
            return () => {
                setIsPlaying( false )
                clearInterval(trackProgressIntervalRef.current)
                setTrackProgress(0)
            }
        }
    }, [ track ])

    const trackLoaded = () => {
        if(type === 'player--collapsed'){
            setTrackMounted( true )
        }
    }

    return(
        <div 
        onClick={ (e) => type !== 'player--collapsed' ? playTrack(e, track ) : console.log(track) }
        // onTouchStart={ (e) => type !== 'player--collapsed' ? playTrack(e, track, queue, setQueue) : console.log(track) }
        className={
            `track 
            ${ activeTrack && 'track--active' }`
        }
        data-trackId={ track.id }>
        {/* Ternary operators determine if this is a playlist or an album. */}

        {
            type === 'artist' &&
            <p> { i + 1 } </p> 
        }

        {
            type!=='collection' &&
                <div className='track__imgContainer'>
                    <img
                    onLoad={ trackLoaded }
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
                type !== 'player--collapsed' &&
                <i className="fas fa-ellipsis-h"
                onClick={ (e) => handleTrackMenu(e, track ) }></i> 
            }

        </div>
    )
}

export default Track