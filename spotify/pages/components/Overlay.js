import { useEffect , useState } from 'react'
import { useSpring, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'

const Overlay = ({ overlay , setOverlay, setActiveItem }) => {
    

    const fadeIn = useSpring({
        opacity: overlay ? 1 : 0,
        pointerEvents: overlay ? 'auto' : 'none'
    })

    const closeOverlay = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setOverlay( null )
    }

    return (
        <animated.div 
            style={fadeIn}
            onClick={ closeOverlay } 
            className='overlay'>
            {
            overlay &&
            <div className='popup'>
                {
                    overlay.type === 'listMenu' &&
                    <ListMenu data={overlay.data} func={overlay.func}/>
                }
                {
                    overlay.type === 'trackMenu' &&
                    <TrackMenu data={overlay.data} overlay={ overlay } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                }
            </div>

            }
        </animated.div>
    )
}

export default Overlay