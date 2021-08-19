import Track from '../Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = ({ navHeight , hiddenUI, playTrack, pauseTrack }) => {

    const trackMountedRef = useRef(false)
    const thisComponentRef = useRef()

    const { audioRef, selectOverlay, dashboardRef, activeManageItem, dashboardState } = useContext( DbHookContext )
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
            bottom: trackMounted ? '0rem' : '-4rem',
            opacity: trackMounted ? 1 : 0,
            transform: navHeight && ((activeManageItem.type && dashboardState ==='manage') ||  hiddenUI )? 'translateY(0px)' : `translateY(-${ navHeight ? navHeight: 0 }px)` ,
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


    return (
        <animated.div
        ref={ thisComponentRef } 
        style={{
            opacity: opacity.to( o => o ),
            bottom: bottom.to( b => b ),
            transform: transform.to( t => t ),
        }} className='playerCollapsed'>
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
                    <i onClick={ pauseTrack } className="fas fa-pause playerCollapsed--playBtn"></i>:
                    <i onClick={ playTrack } className="fas fa-play playerCollapsed--playBtn"></i>

                }
                </>
            }
        </animated.div>
    )
}

export default PlayerCollapsed