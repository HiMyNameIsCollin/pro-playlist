import { useSpring, animated } from 'react-spring'

const Nav = ({ hiddenUI, NavLink, location}) => {

    const hideNav = useSpring({
        transform: hiddenUI ? 'translatey(100%)' : 'translatey(0%)'
    })


    return(
        <animated.nav style={hideNav} className='nav'>
            <ul className='nav__list'>
                <li >
                    <NavLink exact to='/'
                    className='nav__item' 
                    activeClassName='nav__item--active'>
                        <i className="fas fa-igloo"></i>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/search'
                    className='nav__item' 
                    activeClassName='nav__item--active'>
                        <i className="fas fa-search"></i>
                        Search 
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/manage'
                    className='nav__item' 
                    activeClassName='nav__item--active'>
                        <i className="fas fa-i-cursor"></i>
                        Manage
                    </NavLink>
                </li>

            </ul>
        </animated.nav>
    )
}

export default Nav