import { useContext, useState, useRef, useCallback, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import Image from 'next/image'
import Slider from './Slider'
import TabsContainer from './TabsContainer'
import Banner from './banner/Banner'

import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'
import { checkTime } from '../../utils/checkTime'

import { HomePageSettingsContext } from './Home'

const Welcome = ({ style }) => {

    const { activeHomeItem, setActiveHomeItem, } = useContext( DbHookContext )
    const { recently_played, new_releases, featured_playlists, my_top_artists , my_playlists} = useContext( DbFetchedContext )

    const { transitionComplete, setTransitionComplete, setTransMinHeight } = useContext( HomePageSettingsContext )
    const thisComponentRef = useRef() 

    const thisComponent = useCallback(node => {
        if (node !== null) {
            const ro = new ResizeObserver( entries => {
                if( node.offsetHeight > 0 ) setTransMinHeight( node.offsetHeight )
            })
            ro.observe( node )
            thisComponentRef.current = node
            
            return () => ro.disconnect()
        }
      }, [])

    useEffect(() => {
        if( transitionComplete && !activeHomeItem.type ) {
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete(false)
            thisComponentRef.current.style.minHeight = '100vh'
        }
    }, [ transitionComplete ])

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem( 'token_expiry' )
        window.location.reload(false)
    }

    return(
        <animated.div
        style={ style }
        ref={ thisComponent } 
        className='page page--welcome '>
              
            <header className='welcomeHeader'>
                <h1 className='welcomeHeader__title'>{ checkTime() < 12 ? 
                    'Good morning' : checkTime() < 18 ? 
                    'Good afternoon' : checkTime() < 24 ? 
                    'Good evening' : null } </h1>
                <div onClick={ handleLogout }
                className='welcome__logo'>
                    <Image  src='/Spotify_Icon_RGB_White.png' alt='' height='32px' width='32px'/>
                    <p> Log out </p>
                </div>    
            </header>
            <Banner />
            <TabsContainer items={ recently_played }  />
            <Slider 
            message='New Releases' 
            items={ new_releases }
            setActiveItem={ setActiveHomeItem } />
            <Slider 
            message='Featured playlists' 
            items={ featured_playlists }
            setActiveItem={ setActiveHomeItem } /> 
            <Slider
            message='Favorite artists'
            items={ my_top_artists }
            setActiveItem={ setActiveHomeItem }/>
            <Slider 
            message='Favorite playlists'
            items={ my_playlists }
            setActiveItem={ setActiveHomeItem }/>
        </animated.div>
    )
}

export default Welcome