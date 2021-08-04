import { useContext, useState, useRef, useCallback, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import Image from 'next/image'
import Slider from './Slider'
import TabsContainer from './TabsContainer'
import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'
import { checkTime } from '../../utils/checkTime'


const Welcome = ({transition, transitionComplete, setTransitionComplete, setTransMinHeight }) => {

    const { setActiveItem, } = useContext( DbHookContext )
    const { recently_played, new_releases, featured_playlists } = useContext( DbFetchedContext )

    const thisComponentRef = useRef() 

    const [ mounted, setMounted ] = useState(false)

    const thisComponent = useCallback(node => {
        if (node !== null) {
            setTransMinHeight( node.offsetHeight )
            const ro = new ResizeObserver( entries => setTransMinHeight( node.offsetHeight ))
            ro.observe( node )
            thisComponentRef.current = node
            
            return () => ro.disconnect()
        }
      }, []);

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete(false)
            setMounted( true )
        }
    }, [ transitionComplete ])

    useEffect(() => {
        if(mounted) thisComponentRef.current.style.minHeight = '100vh'
    },[ mounted ])

    return(
        <animated.div
        style={ transition }
        ref={ thisComponent } 
        className='page page--welcome '>
            
            <header className='welcomeHeader'>
                <h1 className='welcomeHeader__title'>{ checkTime() < 12 ? 
                    'Good morning' : checkTime() < 18 ? 
                    'Good afternoon' : checkTime() < 24 ? 
                    'Good evening' : null } </h1>
                <div className='welcomeHeader__logo'>
                    <Image  src='/Spotify_Icon_RGB_White.png' alt='' height='32px' width='32px'/>
                </div>      
            </header>
            <TabsContainer items={ recently_played }  />
            <Slider 
            message='New Releases' 
            items={ new_releases }
            setActiveItem={ setActiveItem } />
            <Slider 
            message='Featured playlists' 
            items={ featured_playlists }
            setActiveItem={ setActiveItem } /> 
            
            
        </animated.div>
    )
}

export default Welcome