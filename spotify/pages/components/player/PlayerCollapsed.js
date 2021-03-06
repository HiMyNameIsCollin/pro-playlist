import Track from '../Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = ({ navHeight , hiddenUI, playTrack, pauseTrack, controls }) => {

    const trackMountedRef = useRef(false)
    const thisComponentRef = useRef()

    const [ playerActivated, setPlayerActivated ] = useState( false)
    const { audioRef, selectOverlay, dashboardRef, activeManageItem, dashboardState, sortContainerOpen, sortBar } = useContext( DbHookContext )
    const  { isPlaying, trackProgress, currPlaying, setIsPlaying } = useContext( PlayerHookContext )
    const [ trackMounted, setTrackMounted ] = useState( trackMountedRef.current )

// First song set will trigger the player entry animation.
    useEffect(() => {
        if( trackMounted ){
            trackMountedRef.current = true
        }

        return () => trackMountedRef.current = false
    },[ trackMounted ])

    const { bottom, opacity, transform} = useSpring({
        to: {
            bottom: !sortBar ? '0rem' : '-8rem',
            opacity: trackMounted ? 1 : 0,
            transform: trackMounted ? navHeight && ((activeManageItem.type && dashboardState ==='manage') ||  hiddenUI )? 'translateY(0px)' : `translateY(-${ navHeight ? navHeight - 1 : 0 }px)` : 'translateY(999px)' ,
        }
    })


    const hideForOverlay = ( ele ) => {
        if(selectOverlay[0]){
            ele.style.opacity = 0 
        }else {
            ele.classList.add('transition')
            setTimeout(() =>{
                ele.style.opacity = 1
                setTimeout(() => ele.classList.remove('transition'), 250)
            },250)
        }
    }
    useEffect(() => {
        if( thisComponentRef.current ){
            hideForOverlay( thisComponentRef.current )
        }
    }, [ selectOverlay ])

    const handleActivate = () => {
        controls.playTrack()
        setPlayerActivated( true )
    }


    return (
        <animated.div
        ref={ thisComponentRef } 
        style={{
            opacity: opacity.to( o => o ),
            bottom: bottom.to( b => b ),
            transform: transform.to( t => t ),
        }} className='playerCollapsed'>
            {
                !playerActivated &&
                <div onClick={ handleActivate } className='playerCollapsed__activate'>
                    <p> Click to activate player </p> 
                </div>
            }
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
                    <i onClick={ pauseTrack } className="fas fa-pause playerCollapsed--playBtn"></i>:
                    <i onClick={ playTrack } className="fas fa-play playerCollapsed--playBtn"></i>

                }
                </>
            }
            <div className='playerCollapsed__bar'>
                <div style={{ width: ( trackProgress / (audioRef.current ? audioRef.current.duration : 0 )) * 100 + '%'}} 
                className='playerCollapsed__elapsed'>
                    
                </div>
            </div>
        </animated.div>
    )
}

export default PlayerCollapsed