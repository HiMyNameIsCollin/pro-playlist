import { useContext, useState, useEffect, useCallback} from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'


const Nav = ({homeTransMinHeight, searchTransMinHeight, hiddenUI, dashboardState, setDashboardState , pageScrollRef, activeHomeItem, activeSearchItem, setActiveHomeItem, setActiveSearchItem, scrollPosition, setNavHeight }) => {

    const { selectOverlay, dashboardRef, navHeight, transMinHeight, activeManageItem} = useContext( DbHookContext )

    const thisComponentRef = useCallback( node => {
        if( node !== null){
            const ro = new ResizeObserver( entries => {
                if( node.offsetHeight > 0 ) setNavHeight( node.offsetHeight )
            })
            ro.observe( node )
            thisComponentRef.current = node
            
            return () => ro.disconnect()
        }
    },[])

    // useEffect(() => {
    //     if( selectOverlay.type ){

    //         thisComponentRef.current.style.bottom = dashboardRef.current.scrollTop + window.innerHeight - thisComponentRef.current.offsetHeight
    //     } else {
    //         thisComponentRef.current.style.bottom = 0
    //     }
    // }, [ selectOverlay ])

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

    const hideForOverlay = ( ele ) => {
        if(selectOverlay[0]){
            ele.style.opacity = 0 
        }else {
            ele.classList.add('transition')
            setTimeout(() =>{
                ele.style.opacity = 1
                setTimeout(() => ele.classList.remove('transition'), 250)
            },250)
        }
    }
    useEffect(() => {
        if( thisComponentRef.current ){
            hideForOverlay( thisComponentRef.current )
        }
    }, [ selectOverlay ])

    const {hideNav} = useSpring({
        to:{ hideNav: hiddenUI || (activeManageItem.type && dashboardState ==='manage' ) ? 100 : 0 }
    })


    return(
        <animated.nav 
        ref={ thisComponentRef } 
        style={{
            transform: hideNav.to( h => `translateY(${h}%)`) ,
        }} 
        className='nav'>
            <ul className='nav__list'>
                <li 
                    className={ `nav__item ${ dashboardState === 'home' && 'nav__item--active'}` }>
                    <button onClick={ () => handleDashboardState( 'home' )}>
                        <i className="fas fa-igloo"></i>
                        Home
                    </button>
                </li>
                <li 
                    className={ `nav__item ${ dashboardState === 'search' && 'nav__item--active'}` }>
                    <button onClick={ () => handleDashboardState( 'search' )}>
                        <i className="fas fa-search"></i>
                        Search 
                    </button>
                </li>
                <li 
                    className={ `nav__item ${ dashboardState === 'manage' && 'nav__item--active'}` }>
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