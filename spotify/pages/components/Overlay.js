import { useEffect , useState } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'

const Overlay = ({ overlay , setOverlay, setActiveItem }) => {

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
        initial: { transform: 'translateY(100%)'},
        from: { transform: 'translateY(100%)' , position: 'absolute', width: '100%', pointerEvents: 'none'},
        update: { position: 'relative' },
        enter: { transform: 'translateY(0%)', pointerEvents: 'auto' },
        leave: { transform: 'translateY(100%)' , position: 'absolute'}
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
                        <TrackMenu data={overlay.data} overlay={ overlay } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
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