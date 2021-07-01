import { useContext } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'
import { DbHookContext } from './Dashboard'
import { whichPicture } from '../../utils/whichPicture'
const Overlay = () => {

    const { overlay, setOverlay } = useContext( DbHookContext )

    const { data, type, pageType, func, func2 } = { ...overlay }
    const { selectedTrack, artists, calledFrom, collection } = { ...data }

    const fadeIn = useSpring({
        opacity: type ? 1 : 0,
        pointerEvents: type ? 'auto' : 'none',
    })

    const closeOverlay = () => {
        setOverlay( {} )
    }

    const menuTransition = useTransition(overlay ,{
        initial: { transform: 'translateY(100%)', position: 'absolute'},
        from: { transform: 'translateY(100%)' , pointerEvents: 'none', height: '100%',  position: 'absolute'},
        update: { position: 'relative' },
        enter: { transform: 'translateY(0%)', pointerEvents: 'auto', overflow: 'auto', position: 'absolute' },
        leave: { transform: 'translateY(100%)' }
    })

    return (
        <animated.div 
            style={ fadeIn }
            onClick={ closeOverlay } 
            className={ 
                `overlay 
                ${ overlay.type && overlay.type === 'trackMenuPlayer' && ' overlay--player '} 
                overlay--${pageType}`
                }>
            {
           
            menuTransition((props, item) => (
                item &&
                item.type === 'trackMenu' ||
                item && item.type === 'trackMenuPlayer' ?
                <animated.div className='popup' style={props}>
                    <TrackMenu overlay={ item } setOverlay={ setOverlay } setActiveHomeItem={ item.func } />
                </animated.div> :
                item &&
                item.type === 'listMenu' ?
                <animated.div className='popup'  style={props}>
                    <ListMenu data={item.data} func={item.func}/>
                </animated.div>  :
                
                null
                )
            )

            }
        </animated.div>
    )
}

export default Overlay