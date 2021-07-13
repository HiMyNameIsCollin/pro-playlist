import { useState, useEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'

const FixedHeader = ({ transitionComplete, type, activeHeader, headerScrolled }) => {
    const [ mounted, setMounted ] = useState(false)
    const { setActiveHomeItem, homePageHistoryRef, searchPageHistoryRef, dashboardState } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext ) 
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    
    useEffect(() => {
        if( transitionComplete ) setMounted( true )
    }, [ transitionComplete ])

    useEffect(() => {
        console.log( type )
        if( dashboardState !== type) {
            setMounted(false)
        } else {
            setMounted( true )
        }
    }, [ dashboardState ])

    const { fadeIn, textScroll, btnMove} = useSpring({
        fadeIn: (mounted) ? `${ 0 + ( headerScrolled * 0.01 )}`: `0` ,
        textScroll: (mounted) ?  `${ 200 - ( headerScrolled * 2 )}` : `0` ,
        btnMove: (mounted) ? `${ 50 -( headerScrolled / 2 )}` : `0`
    })

    const handleBackBtn = () => {
        if( type === 'home' ){
            homePageHistoryRef.current.length > 0 ?
            setActiveHomeItem( homePageHistoryRef.current[ homePageHistoryRef.current.length - 1 ].activeItem  ):
            setActiveHomeItem( {} )
        } else if ( type === 'search' ){
            searchPageHistoryRef.current.length > 0 ?
            setActiveSearchItem( searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1 ].activeItem ) :
            setActiveHomeItem( {} )
        }
    }

    return(
        <header className={`fixedHeader fixedHeader--${type}`}>
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

            <animated.h4 style={{
                opacity: fadeIn.to( o => o),
                transform: textScroll.to( y => `translateY(${ y }%)`)
            }}> { activeHeader.data && activeHeader.data } </animated.h4>
        </animated.div>
        </header>

    )
}

export default FixedHeader