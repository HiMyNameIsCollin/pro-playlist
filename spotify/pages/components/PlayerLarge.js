import { useContext, useState, useEffect } from 'react'
import useApiCall from '../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { PlayerHookContext } from './Player'
import { DbHookContext } from './Dashboard'
import { useSpring, animated } from 'react-spring'
import { whichPicture } from '../../utils/whichPicture'


const PlayerLarge = ({ controls }) => {

    const  { currPlaying, isPlaying, repeat, playerSize, setPlayerSize, trackProgress } = useContext( PlayerHookContext )
    const { audioRef, queue, setQueue, overlay, setActiveItem, setOverlay } = useContext( DbHookContext )
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls
    const [ currPlayingContext, setCurrPlayingContext ] = useState( {} )
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    useEffect(() => {
        if( apiPayload ) setCurrPlayingContext( apiPayload )
    },[ apiPayload])

    useEffect(() => {
        if( currPlaying.context.href ){
            finalizeRoute( 'get', currPlaying.context.href.slice(API.length), fetchApi, currPlaying.context.href.slice(-22) )
        } else {
            // For search 
            setCurrPlayingContext({ name: currPlaying.context.name })
        }
    }, [ currPlaying ])

    
    const largePlayerAnimation = useSpring({
        transform: playerSize === 'large' ? 'translateY(0%)' : 'translateY(100%)'
    })

    const togglePlayer = () => {
        setPlayerSize('small')
    }

    const formatTime = ( val, total ) => {
        if( !total ) total = val
        if( !val ) val = 0
        let date = new Date(0)
        date.setSeconds(val)
        let timeString 
        if( total > 3600 ) {
            timeString = date.toISOString().substr(11, 8)
        } else if ( total > 600 ){
            timeString = date.toISOString().substr(14, 5)
        } else {
            timeString = date.toISOString().substr(15, 4)
        }
        return timeString
    }

    const handleTrackMenu = ( e ) => {
        e.stopPropagation()
        let selectedTrack = { ...currPlaying }
        if(!selectedTrack.images){
            if(!selectedTrack.album){
                selectedTrack.images = collection.images
            } else{
                selectedTrack.images = selectedTrack.album.images
            }
        }
        const popupData = {
            collection: currPlayingContext, 
            tracks: null,
            selectedTrack: selectedTrack,
        }
        
        setOverlay( {type: 'trackMenu', data: popupData,  func: null} )
    }

    const handleViewCollection = () => {
        togglePlayer()
        setActiveItem( currPlayingContext )
    }

    return(
        <animated.div
        style={ largePlayerAnimation }
        className='playerLargeContainer'>

            <div className='playerLargeContainer__header'>
                <i
                onClick={ togglePlayer }  
                className="fas fa-chevron-down"></i>
                <h3 
                onClick={ handleViewCollection }> 
                { currPlayingContext.name } 
                </h3>
                <i
                onClick={ handleTrackMenu } 
                className="fas fa-ellipsis-h"></i>
            </div>

            <div className='playerLarge'>
                <div className='playerLarge__track'>
                    <div className='playerLarge__imgContainer'>
                        <img
                        alt={`Album art for ${ currPlaying.artists[0].name }'s  album ${ currPlaying.album.name }`}
                        src={ whichPicture( currPlaying.album.images, 'lrg' ) } />
                    </div>
                    <h3>
                    { currPlaying.name }
                    </h3>
                    <p>
                    { currPlaying.artists[0].name }
                    </p>
                </div>
                
                <div className='playerLarge__progress'>
                    <div className='playerLarge__bar'>
                        <div
                        style={{ width: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                        className='playerLarge__elapsed'>
                        </div>
                        <div
                        style={{ left: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                        className='playerLarge__thumb'>
                        </div>
                    </div>
                    <div className='playerLarge__time'>
                        <span> { formatTime( trackProgress, Math.round( audioRef.current.duration ) ) } </span>
                        <span> -{ formatTime( Math.round( audioRef.current.duration ) ) } </span>
                    </div>
                </div>

                <div className='playerLarge__controls'>
                    <button
                        onClick={ handleRepeat } 
                        className={
                            `playerLarge__trackBtn 
                            ${ repeat !== 'none' && 'playerLarge__trackBtn--active' }`
                        }>
                        {
                            repeat === 'none' ?
                            <i className="fas fa-sync"></i> :
                            repeat === 'all' ?
                            <i className="fas fa-sync"></i> :
                            repeat === 'one' &&
                            <>
                            <i className="fas fa-sync"></i> 
                            <span>1</span>
                            </>
                        }
                    </button>
                    <button
                        onClick={ prevTrack } 
                        className='playerLarge__trackBtn'>
                        <i className="fas fa-step-backward"></i>
                    </button>
                    <button 
                    onClick={ isPlaying ? pauseTrack : playTrack }
                    className='playerLarge__playBtn' >
                    {
                        isPlaying ?
                        <i className="fas fa-pause playerLarge--playBtn"></i>:
                        <i className="fas fa-play playerLarge--playBtn"></i>

                    }
                    </button>
                    <button
                        onClick={ nextTrack } 
                        className='playerLarge__trackBtn'>
                        <i className="fas fa-fast-forward"></i>
                    </button>
                    <button className={
                            `playerLarge__trackBtn`
                        }>
                        <i className="fas fa-american-sign-language-interpreting"></i>
                    </button>
                </div>
                
                <div className='playerLarge__moreBtns'>
                    <button className='playerLarge__spotifyBtn'>
                        <i className="fab fa-spotify"></i> 
                    </button>
                    <button className='playerLarge__queueBtn'>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
                
            </div>
        </animated.div>
    )
}

export default PlayerLarge