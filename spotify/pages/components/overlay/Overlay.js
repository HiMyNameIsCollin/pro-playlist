import { useContext, useRef } from 'react'
import { useTransition, animated } from 'react-spring'
import ListMenu from './ListMenu'
import TrackMenu from './TrackMenu'
import { DbHookContext } from '../Dashboard'

const Overlay = ({ style }) => {

    const overlayRef = useRef()
    const { overlay, setOverlay, setActiveHomeItem, setActiveSearchItem } = useContext( DbHookContext )
    const { calledFrom, page, type, data } = overlay
    const setActiveItem = page === 'home' ||
                        page === 'manage' ||
                        calledFrom === 'player' ?
                        setActiveHomeItem :
                        page === 'search' &&
                        setActiveSearchItem 


    const menuTransition = useTransition(data ,{
        initial: { transform: 'translateY(100%)', position: 'absolute'},
        from: { transform: 'translateY(100%)' , pointerEvents: 'none', position: 'absolute'},
        enter: { transform: 'translateY(0%)', pointerEvents: 'auto', overflow: 'auto', position: 'absolute' },
        leave: { transform: 'translateY(100%)' }
    })

    return(
        <animated.div 
        style={ style }
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