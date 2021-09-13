
import { useState, useEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'
import { SearchHookContext } from './Search'

const SearchHeader = () => {

    const [ mounted, setMounted ] = useState( false )

    useEffect(() => setMounted(true), [])

    const { searchState, setSearchState} = useContext( SearchHookContext )
    const { hiddenUI, selectOverlay, dashboardRef  } = useContext( DbHookContext )
    const hideHeader = useSpring({
        transform: !hiddenUI && mounted && searchState !== 'search' ? 'translateY(0rem)' : 'translateY(-4rem)',
        top: mounted ? selectOverlay[0] ? dashboardRef.current.scrollTop : 0 : -7 * 16
        
    })
    return(
        <animated.header style={hideHeader} className='searchHeader'>
            <p className='searchHeader__title'>
                Search
            </p>
            <div className='searchHeader__search' onClick={() => setSearchState('search') }>
                <i className="fas fa-search"></i>
                <input type='text' placeholder='Search for artists, songs, or podcasts'/>
            </div>
        </animated.header>
    )
}

export default SearchHeader