import { useContext, useEffect, useRef } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'
import { DbHookContext } from './Dashboard'
import { whichPicture } from '../../utils/whichPicture'
const Overlay = ({ setActiveSearchItem }) => {

    const overlayRef = useRef()
    const { overlay, setOverlay } = useContext( DbHookContext )
    const { pageType, type, data } = overlay
    // const pageTypeRef = useRef()

    // useEffect(() => {
    //     if( pageType ) {
    //         overlayRef.current.classList.add(`overlay--${pageType}`)
    //         pageTypeRef.current = pageType
    //     } else {
    //         if( pageTypeRef.current ){
    //             overlayRef.current.classList.remove(`overlay--${pageTypeRef.current}`)
    //             pageTypeRef.current = undefined
    //         }
    //     }
        
    // },[ pageType ])

    const fadeIn = useSpring({
        opacity: type ? 1 : 0,
        pointerEvents: type ? 'auto' : 'none',
    })

    const menuTransition = useTransition(data ,{
        initial: { transform: 'translateY(100%)', position: 'absolute'},
        from: { transform: 'translateY(100%)' , pointerEvents: 'none', position: 'absolute'},
        
        enter: { transform: 'translateY(0%)', pointerEvents: 'auto', overflow: 'auto', position: 'absolute' },
        leave: { transform: 'translateY(100%)' }
    })

    
    return(
        <animated.div 
        style={ fadeIn }
        ref={ overlayRef }
        onClick={ () => setOverlay( {} )}
        className={
        `overlay 
        overlay--${pageType}`}>
        {
            menuTransition(( props, item ) => (
                item.track ?
                <TrackMenu
                transition={ props } 
                setActiveSearchItem={ setActiveSearchItem }
                pageType={ pageType }
                type={ type }
                track={ item.track } /> :
                item.artists &&
                <ListMenu 
                setActiveSearchItem={ setActiveSearchItem }
                transition={ props } 
                pageType={ pageType }
                type={ type }
                artists={ item.artists } />
            ))
        }
        </animated.div>
    )
}

export default Overlay