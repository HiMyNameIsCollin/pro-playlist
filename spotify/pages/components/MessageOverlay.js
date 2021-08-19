import { useEffect, useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from './Dashboard'
const MessageOverlay = ({ style, item  }) => {

    const { setMessageOverlay } = useContext( DbHookContext )
    useEffect(() => {
        setTimeout(() => setMessageOverlay( messages => messages = [ ...messages.slice(1) ]), 4000 )
    }, [])

    return(
        <animated.div 
        style={ style }
        className='messageOverlay'>
            <p>
                { item }
            </p>
        </animated.div>
    )
}

export default MessageOverlay