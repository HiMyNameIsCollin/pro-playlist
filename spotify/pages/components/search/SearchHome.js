import { useCallback, useEffect, useRef, useContext } from 'react'
import { animated } from 'react-spring'
import BrowseContainer from '../BrowseContainer'
import { DbFetchedContext } from '../Dashboard'
import { SearchPageSettingsContext } from './Search'

const SearchHome = ({ style, }) => {

    const thisComponentRef = useRef() 

    const { my_top_categories , all_categories } = useContext( DbFetchedContext )
    const { setTransMinHeight, transitionComplete, setTransitionComplete } = useContext( SearchPageSettingsContext )

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
        if( transitionComplete ) {
            thisComponentRef.current.classList.add('fadeIn')
            thisComponentRef.current.style.minHeight = '100vh'
            setTransitionComplete(false)
        }
    }, [ transitionComplete ])

    return(
        <animated.div 
        style={ style }
        ref={ thisComponent }
        className={ `page page--search ` }>
            <BrowseContainer 
            message='My top genres' 
            data={ 
                my_top_categories.length % 2 !== 0  ?
                my_top_categories.slice( 0, my_top_categories.length - 1 ) :
                my_top_categories
            }/>
            <BrowseContainer
            message='Browse all' 
            data={ all_categories }/> 
        </animated.div> 
    )

}

export default SearchHome