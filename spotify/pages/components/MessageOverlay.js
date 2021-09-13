import { useEffect, useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from './Dashboard'
const MessageOverlay = ({ style, item  }) => {

    const { setMessageOverlay } = useContext( DbHookContext )
    useEffect(() => {
        setTimeout(() => setMessageOverlay( messages => messages = [ ...messages.slice(1) ]), 4000 )
    }, [])

    const closeThisMessage = () => {
        setMessageOverlay( m => m = m.filter( x => x !== item ) )
    }

    return(
        <animated.div 
        onClick={ closeThisMessage }
        style={ style }
        className='messageOverlay'>
            <p>
                { item }
            </p>
        </animated.div>
    )
}

export default MessageOverlay