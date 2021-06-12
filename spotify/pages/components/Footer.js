import { useState, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import Nav from './Nav'
import Player from './Player'
import { DbHookContext } from './Dashboard'


const Footer = ({ location, hiddenUI, NavLink}) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(3.5rem)' : 'translatey(0rem)'
    })

    return(
        <animated.div style={ hideNav } className='bottomUI'>
            <Player />
            
            <Nav location={ location } NavLink={ NavLink } /> 
        </animated.div>

    )
}

export default Footer