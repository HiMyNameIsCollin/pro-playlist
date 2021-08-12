import Track from '../Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = ({ navHeight , hiddenUI }) => {

    const trackMountedRef = useRef(false)

    const { audioRef, hideAll } = useContext( DbHookContext )
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

        return () => trackMountedRef.current = false
    },[ trackMounted ])

    const slideIn = useSpring({
        bottom: trackMounted ? '0rem' : '-4rem',
        opacity: trackMounted ? 1 : 0,
        transform: navHeight && hiddenUI ? 'translateY(0px)' : `translateY(-${ navHeight ? navHeight: 0 }px)` ,
        opacity: hideAll ? 0 : 1
    })

    return (
        <animated.div style={slideIn} className='playerCollapsed'>
            <div className='playerCollapsed__bar'>
                <div style={{ width: ( trackProgress / audioRef.current.duration ) * 100 + '%'}} 
                className='playerCollapsed__elapsed'>
                    
                </div>
            </div>
            {
                currPlaying.album &&
                <>
                <Track 
                    type='playerCollapsed' 
                    track={ currPlaying } 
                    trackMounted={ trackMounted }
                    setTrackMounted={ setTrackMounted }
                    />
                {
                    isPlaying ?
                    <i onClick={ pressPause } className="fas fa-pause playerCollapsed--playBtn"></i>:
                    <i onClick={ pressPlay } className="fas fa-play playerCollapsed--playBtn"></i>

                }
                </>
            }
        </animated.div>
    )
}

export default PlayerCollapsed