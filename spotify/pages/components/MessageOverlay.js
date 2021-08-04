import { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const MessageOverlay = ({ messageOverlay, setMessageOverlay  }) => {

    useEffect(() => {
        if( messageOverlay.active ){
            setTimeout(() => {
                setMessageOverlay( { message: messageOverlay.message, active: false } )
            }, 3000)
            setTimeout(() => {
                setMessageOverlay( { message: '', active: false } )
            }, 3500)
        }
    },[ messageOverlay ])

    const fadeIn = useSpring({
        opacity: messageOverlay.active ? 1 : 0
    })

    return(
        <animated.div 
        style={ fadeIn }
        className='messageOverlay'>
            <p>
                { messageOverlay.message }
            </p>
        </animated.div>
    )
}

export default MessageOverlay