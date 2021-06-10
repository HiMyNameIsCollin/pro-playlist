import Track from './Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { DbHookContext } from './Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = ({ currPlaying, audioRef, setIsPlaying }) => {

    const [ trackMounted, setTrackMounted ] = useState(false)

    const slideIn = useSpring({
        height: trackMounted ? '3rem': '0rem',
        opacity: trackMounted ? 1 : 0
    })

    return (
        <animated.div style={slideIn} className='player player--collapsed'>
            {
                currPlaying.album &&
                <>
                <Track 
                    type='player--collapsed' 
                    track={ currPlaying } 
                    setTrackMounted={ setTrackMounted }
                    setIsPlaying={ setIsPlaying }
                    audioRef={ audioRef }
                    />
                <i className="fas fa-play player--collapsed--playBtn"></i>
                </>
            }
        </animated.div>
    )
}

export default PlayerCollapsed