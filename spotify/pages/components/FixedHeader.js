import { useState, useEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'

const FixedHeader = ({type, activeHeader, headerScrolled }) => {
    const [ hidden, setHidden ] = useState(true)

    const { setActiveHomeItem, homePageHistoryRef, searchPageHistoryRef } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext ) 
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null


    useEffect(() => {
        if( headerScrolled > 50 ){
            setHidden(false)
        } else{
            setHidden( true )
        }
        
    },[headerScrolled])

    const showFixedHeader = useSpring({
        opacity: hidden ? 0 : 1
    })

    const { fadeIn, textScroll, btnMove} = useSpring({
        fadeIn: `${ 0 + ( headerScrolled * 0.01 )}`,
        textScroll: `${ 200 - ( headerScrolled * 2 )}`,
        btnMove: `${ 50 -( headerScrolled / 2 )}`
    })

    const handleBackBtn = () => {
        if( type === 'Home' ){
            homePageHistoryRef.current.length > 0 ?
            setActiveHomeItem( homePageHistoryRef.current[ homePageHistoryRef.current.length - 1 ].activeItem  ):
            setActiveHomeItem( {} )
        } else if ( type === 'Search' ){
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
            opacity: fadeIn.to( y => y )
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