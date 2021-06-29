import { useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const Nav = ({ hiddenUI , dashboardState, setDashboardState , pageScrollRef }) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(100%)' : 'translatey(0%)'
    })

    const handleDashboardState = ( page ) => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop
        pageScrollRef.current[`${dashboardState}`] = winScroll
        setDashboardState(page)
    }


    return(
        <animated.nav style={hideNav} className='nav'>
            <ul className='nav__list'>
                <li 
                    className='nav__item'>
                    <button onClick={ () => handleDashboardState( 'home' )}>
                        <i className="fas fa-igloo"></i>
                        Home
                    </button>
                </li>
                <li 
                    className='nav__item'>
                    <button onClick={ () => handleDashboardState( 'search' )}>
                        <i className="fas fa-search"></i>
                        Search 
                    </button>
                </li>
                <li 
                    className='nav__item'>
                    <button onClick={ () => handleDashboardState( 'manage' )}>
                        <i className="fas fa-i-cursor"></i>
                        Manage
                    </button>
                </li>

            </ul>
        </animated.nav>
    )
}
export default Nav