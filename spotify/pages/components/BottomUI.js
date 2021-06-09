import { useState, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import Nav from './Nav'
import PlayerCollapsed from './PlayerCollapsed'
import { DbHookContext } from './Dashboard'


const BottomUI = ({ location, hiddenUI, NavLink}) => {
    const { queue } = useContext(DbHookContext)

    const [ playerState, setPlayerState ] = useState( 'default' )

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(3.1rem)' : 'translatey(0rem)'
    })

    return(
        <animated.div style={ hideNav } className='bottomUI'>
            {
                playerState === 'default' ? 
                <PlayerCollapsed /> :
                null
            }
            <Nav location={ location } NavLink={ NavLink } /> 
        </animated.div>

    )
}

export default BottomUI