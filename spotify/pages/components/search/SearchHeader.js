
import { useState, useEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

const SearchHeader = ({ setSearchState }) => {

    const [ mounted, setMounted ] = useState( false )

    useEffect(() => setMounted(true), [])

    const { hiddenUI } = useContext( DbHookContext )
    const hideHeader = useSpring({
        transform: !hiddenUI && mounted ? 'translateY(0rem)' : 'translateY(-4rem)',
        top: mounted ? '0rem' : '-7rem'
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