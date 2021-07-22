import { useContext, useEffect, useRef } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'
import { DbHookContext } from './Dashboard'
import { whichPicture } from '../../utils/whichPicture'
const Overlay = ({ setActiveSearchItem }) => {

    const overlayRef = useRef()
    const { overlay, setOverlay, setActiveHomeItem } = useContext( DbHookContext )
    const { calledFrom, page, type, data } = overlay
    const setActiveItem = page === 'home' ||
                        page === 'manage' ||
                        calledFrom === 'player' ?
                        setActiveHomeItem :
                        page === 'search' &&
                        setActiveSearchItem 
    // const calledFromRef = useRef()

    // useEffect(() => {
    //     if( calledFrom ) {
    //         overlayRef.current.classList.add(`overlay--${calledFrom}`)
    //         calledFromRef.current = calledFrom
    //     } else {
    //         if( calledFromRef.current ){
    //             overlayRef.current.classList.remove(`overlay--${calledFromRef.current}`)
    //             calledFromRef.current = undefined
    //         }
    //     }
        
    // },[ calledFrom ])



    const fadeIn = useSpring({
        opacity: data ? 1 : 0,
        pointerEvents: data ? 'auto' : 'none',
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
        overlay--${calledFrom}`}>
        {
            menuTransition(( props, item ) => (
                item.track ?
                <TrackMenu
                transition={ props } 
                setActiveItem={ setActiveItem }
                page={ page }
                calledFrom={ calledFrom }
                type={ type }
                track={ item.track } /> :
                item.artists &&
                <ListMenu 
                setActiveItem={ setActiveItem }
                transition={ props } 
                page={ page }
                calledFrom={ calledFrom }
                type={ type }
                artists={ item.artists } />
            ))
        }
        </animated.div>
    )
}

export default Overlay