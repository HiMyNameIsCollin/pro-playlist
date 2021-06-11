import Track from './Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = () => {

    const trackMountedRef = useRef(false)

    const  { isPlaying, currPlaying, setIsPlaying } = useContext( PlayerHookContext )
    const [ trackMounted, setTrackMounted ] = useState( trackMountedRef.current )

    useEffect(() => {
        if( trackMounted ){
            trackMountedRef.current = true
        }
    },[ trackMounted ])

    const pressPlay = () => {
        setIsPlaying( true )
    }

    const pressPause = () => {
        setIsPlaying( false )
    }

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
                    trackMounted={ trackMounted }
                    setTrackMounted={ setTrackMounted }
                    />
                {
                    isPlaying ?
                    <i onClick={ pressPause } className="fas fa-pause player--collapsed--playBtn"></i>:
                    <i onClick={ pressPlay } className="fas fa-play player--collapsed--playBtn"></i>

                }
                </>
            }
        </animated.div>
    )
}

export default PlayerCollapsed