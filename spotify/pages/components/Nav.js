import { useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const Nav = ({ hiddenUI , setDashboardState }) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(100%)' : 'translatey(0%)'
    })

    return(
        <animated.nav style={hideNav} className='nav'>
            <ul className='nav__list'>
                <li 
                    className='nav__item'>
                    <button onClick={ () => setDashboardState( 'home' )}>
                        <i className="fas fa-igloo"></i>
                        Home
                    </button>
                </li>
                <li 
                    className='nav__item'>
                    <button onClick={ () => setDashboardState( 'search' )}>
                        <i className="fas fa-search"></i>
                        Search 
                    </button>
                </li>
                <li 
                    className='nav__item'>
                    <button onClick={ () => setDashboardState( 'manage' )}>
                        <i className="fas fa-i-cursor"></i>
                        Manage
                    </button>
                </li>

            </ul>
        </animated.nav>
    )
}
export default Nav