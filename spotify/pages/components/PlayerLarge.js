import { useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from './Dashboard'
import { useSpring, animated } from 'react-spring'


const PlayerLarge = () => {

    const  { playerSize, setPlayerSize } = useContext( PlayerHookContext )

    const largePlayerAnimation = useSpring({
        transform: playerSize === 'large' ? 'translateY(0%)' : 'translateY(100%)'
    })

    const togglePlayer = () => {
        setPlayerSize('small')
    }

    return(
        <animated.div 
        style={ largePlayerAnimation }
        onClick={ togglePlayer } 
        className='playerLarge'>
            test
        </animated.div>
    )
}

export default PlayerLarge