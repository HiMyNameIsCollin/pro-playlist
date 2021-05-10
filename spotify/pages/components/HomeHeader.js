import { checkTime } from '../../utils/checkTime'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSpring, animated } from 'react-spring'


const HomeHeader = ({ setAuth , hiddenUI}) => {

    const [showMe, setShowMe] = useState(false)

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_expiry')
        setAuth(false)
    }

    useEffect(() => {
        if(hiddenUI){
            setShowMe(false)
        } else {
            setShowMe(true)
        }
    }, [hiddenUI])


    const hideHeader = useSpring({
        transform: showMe ? 'translatex(0%)' : 'translatex(100%)' ,
        opacity: showMe ? 1 : 0
    })

    return(
        <animated.header style={hideHeader} className='homeHeader' >
            <h1 className='homeHeader__title'>{ checkTime() < 12 ? 
                'Good morning' : checkTime() < 18 ? 
                'Good afternoon' : checkTime() < 24 ? 
                'Good evening' : null } </h1>
            <div className='homeHeader__logo'>
                <Image onClick={ logout } src='/Spotify_Icon_RGB_White.png' alt='' height='32px' width='32px'/>
            </div>           
        </animated.header>
    )
 
}

export default HomeHeader