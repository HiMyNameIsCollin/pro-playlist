import { useContext } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'
import { DbHookContext } from './Dashboard'
import { whichPicture } from '../../utils/whichPicture'
const Overlay = () => {

    const { overlay, setOverlay, setActiveItem } = useContext( DbHookContext )

    const { data } = { ...overlay }
    const { selectedTrack, artists, calledFrom, collection } = { ...data }

    const fadeIn = useSpring({
        opacity: overlay ? 1 : 0,
        pointerEvents: overlay ? 'auto' : 'none'
    })

    const closeOverlay = () => {
        let overlayMod = { ...overlay}
        overlayMod.type = ''
        setOverlay(overlayMod)
        setTimeout(() => setOverlay(null) , 250)
    }

    const menuTransition = useTransition(overlay ,{
        initial: { transform: 'translateY(100%)', position: 'absolute'},
        from: { transform: 'translateY(100%)' , pointerEvents: 'none', height: '100%', position: 'absolute'},
        update: { position: 'relative' },
        enter: { transform: 'translateY(0%)', pointerEvents: 'auto', position: 'absolute' },
        leave: { transform: 'translateY(100%)' }
    })

    return (
        <animated.div 
            style={fadeIn}
            onClick={ closeOverlay } 
            className='overlay'>
            {
            overlay &&
                menuTransition((props, item) => (
                    item && item.type === 'trackMenu' ?
                    <animated.div className='popup' style={props}>
                        <TrackMenu overlay={ overlay } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                    </animated.div> :
                    item && item.type === 'listMenu' &&
                    <animated.div className='popup'  style={props}>
                        <ListMenu data={overlay.data} func={overlay.func}/>
                    </animated.div> 
                    )
                )

            }
        </animated.div>
    )
}

export default Overlay