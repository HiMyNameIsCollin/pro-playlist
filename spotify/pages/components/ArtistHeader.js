import { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { capital } from '../../utils/capital'
import { whichPicture } from '../../utils/whichPicture'
import { handleColorThief } from '../../utils/handleColorThief'
import { calcScroll } from '../../utils/calcScroll'
import { DbHookContext } from './Dashboard'

const ArtistHeader = ({ pageType, data, headerScrolled, setHeaderScrolled, activeHeader, setActiveHeader,  }) => {

    const { collection, artist, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    const thisHeaderRef = useRef()
    const {  scrollPosition } = useContext( DbHookContext )
    
    useLayoutEffect(() => {
        const headerHeight = thisHeaderRef.current.getBoundingClientRect().height
        setElementHeight( headerHeight )

        return () => {
            setHeaderScrolled( 0 )
        }
    },[])
    
    const finishMount = (e, amount)=>{
        const colors = handleColorThief(e.target, amount)
        colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${pageType}${i}`, clr))
        setActiveHeader({ data: artist.name})
    }

    useEffect(() => {
        const percent = calcScroll( elementHeight )
        setHeaderScrolled( percent <= 100 ? percent : 100 )
    }, [scrollPosition , elementHeight])


    const { fadeOut } = useSpring({
        to: {
            fadeOut: `${ 1 - ( headerScrolled * 0.02 )}`,
        },
        config: {
            precision: 1,
        }
    })

    return(
        <header 
        ref={ thisHeaderRef }
        className={ `artistHeader  }`}>
            <div className={`headerBacking headerBacking--${pageType}`}></div>
                <div className='artistHeader__imgContainer'>
                <img 
                crossOrigin='anonymous' 
                // ON LOAD HERE ########################################
                onLoad={(e) => finishMount(e, 2)}
                src={ whichPicture(artist.images, 'lrg') }
                alt='Artist'
                /> 
                <animated.h1 style={{
                    opacity: fadeOut.to( o => o )
                }}> {artist.name} </animated.h1>
            </div>
            <div className='artistHeader__info'>
                <p> { artist.followers.total } followers </p>
                <button> Follow </button>
                <i className="fas fa-ellipsis-h"></i>
            </div>
        </header>  
         
    )

}

export default ArtistHeader