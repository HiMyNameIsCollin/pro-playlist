import { useRef, useEffect, useLayoutEffect, useState, useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

import BrowseContainer from '../BrowseContainer'
const SearchHome = ({ state, transition, setTransMinHeight, transitionComplete, setTransitionComplete }) => {

    const thisComponentRef = useRef()
    const { overlay } = useContext( DbHookContext )
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
        style={transition}
        ref={ thisComponentRef }
        className={ `page page--search ${ overlay.type && 'page--blurred' }` }>
            <BrowseContainer 
            type='BcSearch'
            message='My top genres' 
            data={ state.my_top_genres.slice(0, 4) }/>
            <BrowseContainer
            message='Browse all' 
            type='BcSearch'
            data={ state.all_categories }/> 
        </animated.div> 
    )

}

export default SearchHome