import { useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const Nav = ({homeTransMinHeight, searchTransMinHeight, hiddenUI, dashboardState, setDashboardState , pageScrollRef, activeHomeItem, activeSearchItem, setActiveHomeItem, setActiveSearchItem, scrollPosition }) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(100%)' : 'translatey(0%)',
    })

    const handleDashboardState = ( page ) => {
        if( dashboardState !== page ){
            const height = dashboardState === 'search' ? searchTransMinHeight : homeTransMinHeight
            const scroll = Math.round( height * ( scrollPosition / 100 ) )
            pageScrollRef.current[`${dashboardState}`] = scroll
            setDashboardState(page)
            
            
        } else {
            if( page === 'home' && activeHomeItem.type ){
                setActiveHomeItem( {} )
            } else if ( page === 'search' && activeSearchItem.type  ){
                setActiveSearchItem( {} )
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
                        Manager
                    </button>
                </li>

            </ul>
        </animated.nav>
    )
}
export default Nav