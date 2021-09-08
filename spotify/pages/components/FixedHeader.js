import { useState, useEffect, useContext, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'
import { SearchPageSettingsContext } from './search/Search'
import { HomePageSettingsContext } from './Home'

const FixedHeader = ({ style, page, }) => {

    const [ mounted, setMounted ] = useState(false)

    const { setActiveHomeItem, homePageHistoryRef, searchPageHistoryRef } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext ) 
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    const { transitionComplete, activeHeader, headerScrolled } = useContext( page === 'search' ? SearchPageSettingsContext : HomePageSettingsContext )
    const setActiveItem = page === 'home' ? setActiveHomeItem : setActiveSearchItem
    const thisComponentRef = useRef()

    useEffect(() => {
        if( transitionComplete ) setMounted( true )
    }, [ transitionComplete ])

    const { fadeIn, textScroll, btnMove} = useSpring({
        fadeIn: (mounted) ? `${ 0 + ( headerScrolled * 0.01 )}`: `0` ,
        textScroll: (mounted) ?  `${ 200 - ( headerScrolled * 2 )}` : `0` ,
        btnMove: (mounted) ? `${ 50 -( headerScrolled / 2 )}` : `0`,
    })

    const handleBackBtn = () => {
        if( page === 'home' ){
            homePageHistoryRef.current.length > 0 ?
            setActiveItem( homePageHistoryRef.current[ homePageHistoryRef.current.length - 1 ].activeItem  ):
            setActiveItem( {} )
        } else if ( page === 'search' ){
            searchPageHistoryRef.current.length > 0 ?
            setActiveItem( searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1 ].activeItem ) :
            setActiveItem( {} )
        }
    }

    return(
        <animated.header style={{ 
            position: style.position.to( p => p ),
            transform: style.transform.to( x => x),
            width: style.width.to( w => w ),
            top: style.top.to( t => t )
            }} ref={ thisComponentRef } className={`fixedHeader fixedHeader--${page}`}>
        <animated.button
            onClick={ handleBackBtn }
            style={{
                transform: btnMove.to( y => `translateX(${ y }%)`)
            }} 
            className='fixedHeader__backBtn'>
            <i className="fas fa-chevron-left"></i>
        </animated.button>
        <animated.div
        className='fixedHeader__main'
        style={{ 
            opacity: fadeIn.to( y => y)
        }} >

            <animated.p 
            className='fixedHeader__title'
            style={{
                opacity: fadeIn.to( o => o),
                transform: textScroll.to( y => `translateY(${ y }%)`)
            }}> { activeHeader.data && activeHeader.data } </animated.p>
        </animated.div>
        </animated.header>

    )
}

export default FixedHeader