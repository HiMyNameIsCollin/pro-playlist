
import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const SearchHeader = ({ hiddenUI }) => {

    const [ showMe, setShowMe ] = useState(false)

    useEffect(() => {
        if(hiddenUI){
            setShowMe(false)
        } else {
            setShowMe(true)
        }
    },[ hiddenUI ])

    const hideHeader = useSpring({
        top: showMe ? '0rem' : '-5rem'
    })
    return(
        <animated.header style={hideHeader} className='searchHeader'>
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