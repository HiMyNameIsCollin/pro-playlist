import { useContext , useState, useEffect, useRef} from 'react'
import { DbHookContext } from '../Dashboard'
import { PlayerHookContext } from './Player'

import { whichPicture } from '../../../utils/whichPicture'
import Controls from './Controls'
import { FrameValue } from 'react-spring'

const PlayingView = ({ controls, queueView, setQueueView }) => {

    const progressBarRef = useRef()
    const progressRef = useRef()
    const [ scrubActive, setScrubActive ] = useState( false )

    const { audioRef, queue, setQueue, overlay, setOverlay } = useContext( DbHookContext )
    const  { currPlaying, isPlaying, repeat, playerSize, setPlayerSize, trackProgress, setTrackProgress, shuffle, setShuffle } = useContext( PlayerHookContext )
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat, trackProgressIntervalRef, startTimer } = controls

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

    const openInSpotify = (e) => {
        e.stopPropagation()
        window.open( currPlaying.external_urls.spotify )
    }

    const handleScrub = (e) => {
        setScrubActive(true)
    }
    useEffect(() => {
        if( scrubActive ) {
            window.addEventListener( 'pointermove', handleDrag )
            window.addEventListener( 'pointerup', stopDrag )
            window.addEventListener( 'touchmove', handleDrag )
            window.addEventListener( 'touchend', stopDrag )
            window.addEventListener( 'touchcancel', stopDrag )

        } else {
            removeListeners()
        }
        return () => {
            removeListeners()
            
        }
    }, [ scrubActive ])

    const removeListeners = () => {
        window.removeEventListener('pointermove', handleDrag)
        window.removeEventListener( 'pointerup', stopDrag )
        window.removeEventListener( 'touchmove', handleDrag )
        window.removeEventListener( 'touchend', stopDrag )
        window.addEventListener( 'touchcancel', stopDrag )
    }


    const handleDrag = (e) =>{
        e.stopPropagation()
        clearInterval( trackProgressIntervalRef.current )
        const bar = progressBarRef.current.getBoundingClientRect()
        const barLeft = bar.left
        const barRight = bar.right
        const barWidth = bar.width
        const diff = window.innerWidth - barWidth
        let pos = 0
        if( e.type === 'touchmove'){
            pos = e.touches[0].clientX
        } else {
            pos = e.clientX
        }
        if(pos < barLeft ){
            pos = barLeft
        } else if( pos > barRight ){
            pos = barRight
        } 
        const value = ((pos - diff/2) / barWidth)  * audioRef.current.duration 
        setTrackProgress( value )
        progressRef.current = value
    }

    const stopDrag = (e) => {
        setScrubActive(false)
        audioRef.current.currentTime = progressRef.current
        startTimer() 
    }

    

    return(
        <div className='playingView'>
            
            <div className='playingView__track'>
                <div className='playingView__imgContainer'>
                    <img
                    alt={`Album art for ${ currPlaying.artists[0].name }'s  album ${ currPlaying.album.name }`}
                    src={ whichPicture( currPlaying.album.images, 'lrg' ) } />
                </div>
                <p className='playingView__title'>
                { currPlaying.name }
                </p>
                <p className='playingView__info'>
                { currPlaying.artists[0].name }
                </p>
            </div>
            
            <div
            ref={ progressBarRef } 
            className='playingView__progress'>
                <div className='playingView__bar'>
                    <div
                    style={{ width: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                    className='playingView__elapsed'>
                    </div>
                    <div
                    onPointerDown={ handleScrub }
                    style={{ left: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                    className='playingView__thumb'>
                    </div>
                </div>
                <div className='playingView__time'>
                    <span> { formatTime( trackProgress, Math.round( audioRef.current.duration ) ) } </span>
                    <span> -{ formatTime( Math.round( audioRef.current.duration ) ) } </span>
                </div>
            </div>

            <Controls controls={ controls } />
            
            <div className='playingView__moreBtns'>
                <button onClick={ openInSpotify } className='playingView__spotifyBtn'>
                    <i className="fab fa-spotify"></i> 
                </button>
                <button
                onClick={ () => setQueueView( !queueView ) } 
                className='playingView__queueBtn'>
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            
        </div>
    )
}

export default PlayingView