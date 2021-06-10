import Track from './Track'
import { useState, useEffect, useRef, useContext } from 'react'
import { DbHookContext } from './Dashboard'
import { useSpring, animated } from 'react-spring'
const PlayerCollapsed = ({ playing }) => {

    const [ trackMounted, setTrackMounted ] = useState(false)

    const slideIn = useSpring({
        height: trackMounted ? '3rem': '0rem',
        opacity: trackMounted ? 1 : 0
    })

    return (
        <animated.div style={slideIn} className='player player--collapsed'>
            {
                playing.album &&
                <>
                <Track type='player--collapsed' track={ playing } setTrackMounted={setTrackMounted}/>
                <i className="fas fa-play player--collapsed--playBtn"></i>
                </>
            }
        </animated.div>
    )
}

export default PlayerCollapsed