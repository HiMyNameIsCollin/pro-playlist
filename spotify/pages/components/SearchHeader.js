
import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const SearchHeader = ({ hiddenUI, headerHeightRef }) => {

    const [ mounted, setMounted ] = useState (false)

    
    useEffect(() => {
        setMounted( true )
    },[])



    const hideHeader = useSpring({
        top: !hiddenUI ? '0rem' : '-5rem',
        transform: mounted ? 'translateY( 0% )' : 'translateY( -100% )'
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