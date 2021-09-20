
import { useState, useEffect, useContext, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'
import { SearchHookContext } from './Search'
import { SearchPageSettingsContext } from './Search'

const SearchHeader = ({ style }) => {

    const [ mounted, setMounted ] = useState( false )

    const { searchState, setSearchState, activeSearchItem} = useContext( SearchHookContext )
    const { hiddenUI, selectOverlay, dashboardRef  } = useContext( DbHookContext )
    const { transitionComplete } = useContext( SearchPageSettingsContext )
    const thisHeaderRef = useRef()

    useEffect(() => setMounted(true), [])
    useEffect(() => {
        if( transitionComplete && !activeSearchItem.type ) {
            thisHeaderRef.current.parentElement.style.zIndex = 4
        }
    }, [ transitionComplete ])

    const morph = useSpring({
        width: searchState === 'search' ? '90%' : '100%',
        padding: searchState === 'search' ? '1rem' : '0.5rem'
    })
    return(
        <animated.header ref={ thisHeaderRef } style={style} className='searchHeader'>
            <p className='searchHeader__title'>
                Search
            </p>
            <animated.div style={ morph } className='searchHeader__search' onClick={() => setSearchState('search') }>
                <i className="fas fa-search"></i>
                <input type='text' placeholder='Search for artists, songs, or podcasts'/>
            </animated.div>
        </animated.header>
    )
}

export default SearchHeader