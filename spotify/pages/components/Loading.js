import Image from 'next/image'
import { useSpring, animated } from 'react-spring'

const Loading = ({ loaded }) => {

    const animation = useSpring({
        transform: loaded ? 'translatey(100%)' : 'translatey(0%)' 
    })

    return(
        <animated.div style={animation} className='loading'>
            <Image 
            src='/Spotify_Icon_RGB_Green.png' 
            alt='Loading'
            width='300'
            height='300' />
        </animated.div>
    )
}

export default Loading