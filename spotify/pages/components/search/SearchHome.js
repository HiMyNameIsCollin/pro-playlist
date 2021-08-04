import { useCallback, useEffect, useState, useRef, useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

import BrowseContainer from '../BrowseContainer'
const SearchHome = ({ state, transition, setTransMinHeight, transitionComplete, setTransitionComplete }) => {

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
        style={transition}
        ref={ thisComponent }
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