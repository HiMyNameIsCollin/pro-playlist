

const Nav = ({ NavLink, location}) => {




    return(
        <nav className='nav'>
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
        </nav>
    )
}

export default Nav