import { useContext } from 'react'
import { DbHookContext } from '../Dashboard'
import { PlayerHookContext } from './Player'

import { whichPicture } from '../../../utils/whichPicture'
import Controls from './Controls'

const PlayingView = ({ controls, queueView, setQueueView }) => {

    const { audioRef, queue, setQueue, overlay, setOverlay } = useContext( DbHookContext )
    const  { currPlaying, isPlaying, repeat, playerSize, setPlayerSize, trackProgress, shuffle, setShuffle } = useContext( PlayerHookContext )


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
            
            <div className='playingView__progress'>
                <div className='playingView__bar'>
                    <div
                    style={{ width: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                    className='playingView__elapsed'>
                    </div>
                    <div
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