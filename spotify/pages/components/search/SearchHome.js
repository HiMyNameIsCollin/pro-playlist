import { useRef, useEffect, useLayoutEffect, useState, useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

import BrowseContainer from '../BrowseContainer'
const SearchHome = ({ state, transition, setTransMinHeight, transitionComplete, setTransitionComplete }) => {

    const thisComponentRef = useRef()

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.style.minHeight = '100vh'
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete( false )
        }
    },[ transitionComplete ])
    
    useLayoutEffect(() => {
        const cb = (mutList, observer) => {
            setTransMinHeight( thisComponentRef.current.offsetHeight)
        }
        const config = { attributes: true, childList: false, subtree: false }
        const obs = new MutationObserver(cb)
        obs.observe( thisComponentRef.current, config)
        return () => obs.disconnect() 
    },[])

    return(
        <animated.div 
        style={transition}
        ref={ thisComponentRef }
        className={ `page page--search ` }>
            <BrowseContainer 
            type='BcSearch'
            message='My top genres' 
            data={ 
                state.my_top_categories.length % 2 !== 0  ?
                state.my_top_categories.slice( 0, state.my_top_categories.length - 1 ) :
                state.my_top_categories
            }/>
            <BrowseContainer
            message='Browse all' 
            type='BcSearch'
            data={ state.all_categories }/> 
        </animated.div> 
    )

}

export default SearchHome