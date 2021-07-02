
import { useState, useEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const SearchHeader = ({  headerHeightRef }) => {

    const [ mounted, setMounted ] = useState( false )

    useEffect(() => setMounted(true), [])

    const { hiddenUI } = useContext( DbHookContext )
    const hideHeader = useSpring({
        transform: !hiddenUI && mounted ? 'translateY(0rem)' : 'translateY(-4rem)',
        top: mounted ? '0rem' : '-7rem'
    })
    return(
        <animated.header ref={ headerHeightRef } style={hideHeader} className='searchHeader'>
            <h1 className='searchHeader__title'>
                Search
            </h1>
            <form className='searchHeader__search'>
                <i className="fas fa-search"></i>
                <input type='text' placeholder='Search for artists, songs, or podcasts'/>
            </form>
        </animated.header>
    )
}

export default SearchHeader