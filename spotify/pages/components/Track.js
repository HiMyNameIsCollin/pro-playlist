import { useState, useLayoutEffect, useEffect, useContext, useRef } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { PlayerHookContext } from './Player'

const Track = ({ type, i , track, handleTrackMenu, trackMounted, setTrackMounted}) => {
    const [ activeTrack, setActiveTrack ] = useState(false)
    
    const { queue, setQueue, audioRef } = useContext( DbHookContext )
    const playerContext = useContext( type === 'player--collapsed' ? PlayerHookContext : '' )
    
    const isPlaying = playerContext ?  playerContext.isPlaying : null
    const setIsPlaying = playerContext ? playerContext.setIsPlaying: null
    const trackProgressIntervalRef = playerContext ? playerContext.trackProgressIntervalRef : null

    useLayoutEffect(() => {
        if( queue[0] && queue[0].id === track.id && type !=='player--collapsed' ){
            setActiveTrack( true )
        }else {
            setActiveTrack( false )
        }
    },[ queue ])

    const playTrack = (e, track, arr, func ) =>{
        e.stopPropagation()
        // Adds track to Queue. Callback func is 'setQueue'
        if(arr[0] && arr[0].id !== track.id) {
            if( type === 'search' ){

            }else(
                func( arr => arr = [track, ...arr.slice(1, arr.length-1)] )
    
            )
        }
    }

    useEffect(() => {
        if(type === 'player--collapsed'){
            audioRef.current.pause()
            audioRef.current.src = track.preview_url 
            if( trackMounted ) {
                const promise = new Promise(( res, rej ) => {
                    const checkReady = () => {
                        if(audioRef.current.readyState === 4){
                            resolvePromise()
                        }
                    }
                    const interval = setInterval(checkReady, 500)
                    const resolvePromise = () => {
                        clearInterval(interval)
                        res('success')
                    }
                })
                promise
                .then( value => value === 'success' && setIsPlaying( true ))               
            }    
            return () => {
                setIsPlaying( false )
                clearInterval(trackProgressIntervalRef.current)
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
        onClick={ (e) => type !== 'player--collapsed' ? playTrack(e, track, queue, setQueue) : console.log(track) }
        // onTouchStart={ (e) => type !== 'player--collapsed' ? playTrack(e, track, queue, setQueue) : console.log(track) }
        className={
            `track ${ activeTrack && 'track--active' }`
        }>
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