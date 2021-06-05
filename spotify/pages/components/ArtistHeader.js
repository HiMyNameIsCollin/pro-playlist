import { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import { capital } from '../../utils/capital'
import { whichPicture } from '../../utils/whichPicture'
import { handleColorThief } from '../../utils/handleColorThief'
import { calcScroll } from '../../utils/calcScroll'
import HeaderBacking from './HeaderBacking'
import { DbHookContext } from './Dashboard'

const ArtistHeader = ({ data }) => {

    const { collection, artist, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ scrolled, setScrolled ] = useState(null)
    const [ fullHeader, setFullHeader ] = useState(true)
    const { setOverlay, setActiveItem, headerMounted, setHeaderMounted, scrollPosition } = useContext( DbHookContext )
    
    useLayoutEffect(() => {
        const thisHeader = document.querySelector('.artistHeader')
        document.documentElement.style.setProperty('--headerHeight', thisHeader.offsetHeight + 'px')
        setElementHeight(thisHeader.offsetHeight)
        
        return () => {
            document.documentElement.style.setProperty('--headerColor0', 'initial')
            document.documentElement.style.setProperty('--headerColor1', 'initial')
        }
    },[])
    
    const finishMount = (e, amount)=>{
        const colors = handleColorThief(e.target, amount)
        colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${i}`, clr))
        setHeaderMounted(true)
    }

    useEffect(() => {
        const percent = calcScroll(elementHeight )
        setScrolled( percent <= 100 ? percent : 100 )
    }, [scrollPosition , elementHeight])

    useEffect(() => {
        if(scrolled >= 50){
            setFullHeader(false)
        } else{
            setFullHeader(true)
        }
    }, [ scrolled ])

    const {scaleDown, scaleUp, fadeOut, fadeIn, moveDown, textScroll} = useSpring({
        to: {
            
            scaleDown: `${ 1.00 - ( scrolled * 0.005 )  }`,
            scaleUp: `${ 1.00 + ( scrolled * 0.01 ) }`,
            fadeOut: `${ 1 - ( scrolled * 0.02 )}`,
            fadeIn: `${ 0 + ( scrolled * 0.01 )}`,
            textScroll: `${ 200 - ( scrolled * 2 )}`,
            moveDown: `${ (scrolled * 2 )  }`
        },
        config: {
            precision: 1,
        }
    })

    return(
        <>
        <HeaderBacking 
        fadeIn={ fadeIn } 
        textScroll={ textScroll } 
        fullHeader={ fullHeader }
        data={ artist } 
        headerMounted={ headerMounted } />
        <header className={ `artistHeader ${headerMounted && 'artistHeader--active' }`}>
            <div className='artistHeader__imgContainer'>
                <img 
                crossorigin='anonymous' 
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
        </>    
    )

}

export default ArtistHeader