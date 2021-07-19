import { useContext, useLayoutEffect, useRef, useEffect } from 'react'
import { animated } from 'react-spring'
import Slider from './Slider'
import TabsContainer from './TabsContainer'
import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'

const Welcome = ({transition, transitionComplete, setTransitionComplete, setTransMinHeight }) => {

    const { setActiveItem, } = useContext( DbHookContext )
    const { recently_played, new_releases, featured_playlists } = useContext( DbFetchedContext )
    const thisComponentRef = useRef()

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.style.minHeight = '100vh'
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete( false )
        }
    },[ transitionComplete ])


    useLayoutEffect(() => {
        setTransMinHeight(thisComponentRef.current.offsetHeight)
    })



    return(
        <animated.div
        style={ transition }
        ref={ thisComponentRef } 
        className='page page--welcome '>

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