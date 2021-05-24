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
        setOverlay( null )
    }

    const menuTransition = useTransition(overlay ,{
        initial: { transform: 'translateY(100%)'},
        from: { transform: 'translateY(100%)' , position: 'absolute', width: '100%'},
        update: { position: 'relative' },
        enter: { transform: 'translateY(0%)' },
        leave: { transform: 'translateY(-100%)' , position: 'absolute'}
    })

    return (
        <animated.div 
            style={fadeIn}
            onClick={ closeOverlay } 
            className='overlay'>
            {
            overlay &&
            <div className='popup'>
                {
                    menuTransition((props) => (
                        
                            overlay.type === 'listMenu' ?
                            <animated.div style={ props }>
                                <ListMenu data={overlay.data} func={overlay.func}/>
                            </animated.div> : 
                     
                            overlay.type === 'trackMenu' &&
                            <animated.div style={ props }>
                            <TrackMenu data={overlay.data} overlay={ overlay } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                            </animated.div>
                    ))
                }

            </div>

            }
        </animated.div>
    )
}

export default Overlay