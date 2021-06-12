import Track from './Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from './Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = () => {

    const trackMountedRef = useRef(false)

    const { audioRef } = useContext( DbHookContext )
    const  { isPlaying, trackProgress, currPlaying, setIsPlaying } = useContext( PlayerHookContext )
    const [ trackMounted, setTrackMounted ] = useState( trackMountedRef.current )

    const pressPlay = () => {
        setIsPlaying( true )
    }

    const pressPause = () => {
        setIsPlaying( false )
    }


// First song set will trigger the player entry animation.
    useEffect(() => {
        if( trackMounted ){
            trackMountedRef.current = true
        }
    },[ trackMounted ])

    const slideIn = useSpring({
        height: trackMounted ? '3.5rem': '0rem',
        opacity: trackMounted ? 1 : 0
    })

    return (
        <animated.div style={slideIn} className='player player--collapsed'>
            <div className='player--collapsed__progress'>
                <div style={{ width: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                className='player--collapsed__progress__thumb'>
                    
                </div>
            </div>
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