import { useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const Nav = ({ hiddenUI , dashboardState, setDashboardState , pageScrollRef, searchPageHistoryRef, homePageHistoryRef, setActiveHomeItem, setActiveSearchItem }) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(100%)' : 'translatey(0%)'
    })

    const handleDashboardState = ( page ) => {
        if( dashboardState !== page ){
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop
            pageScrollRef.current[`${dashboardState}`] = winScroll
            setDashboardState(page)
        } else {
            let lastItem
            if( page === 'home' ){
                lastItem = homePageHistoryRef.current.length > 0 ?
                homePageHistoryRef.current[ homePageHistoryRef.current.length - 1 ].activeItem :
                {}
                setActiveHomeItem( lastItem )
            } else if ( page === 'search' ){
                lastItem = searchPageHistoryRef.current.length > 0 ?
                searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1 ] :
                {}
                setActiveSearchItem( lastItem )
            }
            
        }
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