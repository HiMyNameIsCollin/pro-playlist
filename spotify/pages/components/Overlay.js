import { useEffect , useState } from 'react'
import { useSpring, animated } from 'react-spring'
import ListMenu from './overlay/ListMenu'
import TrackMenu from './overlay/TrackMenu'

const Overlay = ({ overlay , setOverlay }) => {
    

    const fadeIn = useSpring({
        opacity: overlay ? 1 : 0,
        pointerEvents: overlay ? 'auto' : 'none'
    })

    return (
        <animated.div 
            style={fadeIn}
            onClick={ () => setOverlay( null ) } 
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
                    <TrackMenu data={overlay.data} func={overlay.func}/>
                }
            </div>

            }
        </animated.div>
    )
}

export default Overlay