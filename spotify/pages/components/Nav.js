import { useContext, useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'

const Nav = ({ hiddenUI }) => {

    const [ activeLink, setActiveLink ] = useState()
    const { setActiveSearchItem  } = useContext( DbHookContext )
    const location = useLocation()

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(3.06rem)' : 'translatey(0rem)'
    })

    useEffect(() => {
        const links = document.querySelectorAll('.nav__item')
        if( location.pathname === '/search'){
            setActiveLink('search')
        } else if (location.pathname === '/manage'){
            setActiveLink('manage')
        } else {
            setActiveLink('home')
        }
    },[ location ])
     
    const handleSearchReset = () => {
        if( location.pathname === '/search'){
            setActiveSearchItem( {} )
        }
    }


    return(
        <animated.nav style={hideNav} className='nav'>
            <ul className='nav__list'>
                <li >
                    <Link exact to='/'
                    className={
                        `nav__item ${ activeLink === 'home' && 'nav__item__active'}`
                    } >
                        <i className="fas fa-igloo"></i>
                        Home
                    </Link>
                </li>
                <li onClick={ handleSearchReset }>
                    <Link
                    
                    to='/search'
                    className={
                        `nav__item ${ activeLink === 'search' && 'nav__item__active'}`
                    } >
                        <i className="fas fa-search"></i>
                        Search 
                    </Link>
                </li>
                <li>
                    <Link to='/manage'
                    className={
                        `nav__item ${ activeLink === 'manage' && 'nav__item__active'}`
                    } >
                        <i className="fas fa-i-cursor"></i>
                        Manage
                    </Link>
                </li>

            </ul>
        </animated.nav>
    )
}

export default Nav