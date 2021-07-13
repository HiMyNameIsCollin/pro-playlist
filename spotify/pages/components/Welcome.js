import { useContext, useLayoutEffect, useRef, useEffect } from 'react'
import { animated } from 'react-spring'
import Slider from './Slider'
import TabsContainer from './TabsContainer'
import { DbHookContext } from './Dashboard'

const Welcome = ({transition, transitionComplete, setTransitionComplete, setTransMinHeight, state }) => {

    const { setActiveItem, } = useContext(DbHookContext)
    const thisComponentRef = useRef()

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.style.minHeight = 0
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

            <TabsContainer items={ state.recently_played }  />
            <Slider 
            message='New Releases' 
            items={ state.new_releases }
            setActiveItem={ setActiveItem } />
            <Slider 
            message='Featured playlists' 
            items={ state.featured_playlists }
            setActiveItem={ setActiveItem } /> 
        </animated.div>
    )
}

export default Welcome