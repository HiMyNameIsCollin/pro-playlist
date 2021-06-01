import { useSpring, useTransition, animated } from 'react-spring'
import { useLayoutEffect, useEffect, useState, useRef } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { handleViewArtist } from '../../utils/handleViewArtist'
import { capital } from '../../utils/capital'
import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs'
import HeaderBacking from './HeaderBacking'



const CollectionHeader = ({ data , setOverlay, setActiveItem, headerMounted, setHeaderMounted , scrollPosition}) => {
    const { collection, artists, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ scrolled, setScrolled ] = useState(null)
    const [ fullHeader, setFullHeader ] = useState(true)
    const elementPercentRef = useRef(elementHeight)

    useLayoutEffect(() => {
        const thisHeader = document.querySelector('.collectionHeader')
        document.documentElement.style.setProperty('--collectionHeaderHeight', thisHeader.offsetHeight + 'px')
        setElementHeight(thisHeader.offsetHeight)

        return () => {
            document.documentElement.style.setProperty('--collectionHeaderColor0', 'initial')
            document.documentElement.style.setProperty('--collectionHeaderColor1', 'initial')
        }
    }, [])

    useEffect(() => {
        // WILL NEED TO MAKE A RESIZING HOOK AND MAKE THIS IT A DEPENDENCY OF THIS UE
        if( elementHeight ){
            const totalHeight = document.documentElement.scrollHeight
            const percentOfTotal = ( elementHeight / totalHeight ) * 100 
            elementPercentRef.current = percentOfTotal
        }
    },[ elementHeight ])

    useEffect(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const percent = (winScroll / elementHeight) * 100
        setScrolled( percent <= 100 ? percent : 100 )
    }, [scrollPosition , elementHeight])

    useEffect(() => {
        if(scrolled >= 50){
            setFullHeader(false)
        } else{
            setFullHeader(true)
        }
    }, [ scrolled ])

    const headerAni = useSpring({
        to: {
            
            scaleDown: `${ 1.00 - ( scrolled * 0.01 )  }`,
            scaleUp: `${ 1.00 + ( scrolled * 0.01 ) }`,
            fadeOut: `${ 1 - ( scrolled * 0.02 )}`,
            fadeIn: `${ 0 + ( scrolled * 0.01 )}`,
            slideUp: `${ -scrolled - 2 }`,
            textScroll: `${ 300 - ( scrolled * 3 )}`
        },
        config: {
            precision: 1,
        }
    })

    const handleColorThief = (e) => {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(e.target , 2)
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
          }).join('')
        console.log(palette)
        const colors = palette.map((clrArray) => {
            return rgbToHex(...clrArray)
        })
        colors.map((clr, i) => document.documentElement.style.setProperty(`--collectionHeaderColor${i}`, clr) )
        setHeaderMounted(true)
    }
    
    return(
        <>  
            <HeaderBacking
            headerAni={ headerAni }
            fullHeader={ fullHeader } 
            collection={ collection }
            headerMounted={ headerMounted }
             />          
            <animated.header 
            style={{
                transform: headerAni.scaleDown.to( scaleDown =>  `scaleY(${scaleDown})`)
            }}
            className={`collectionHeader ${headerMounted && 'collectionHeader--active' }`}>
                
                <animated.div
                    style={{
                        transform: headerAni.scaleDown.to( scaleDown => `scale(${scaleDown})`),
                        opacity: headerAni.fadeOut.to( fadeOut => fadeOut )
                    }} 
                    className='collectionHeader__imgContainer'>
                    <img
                    crossorigin='anonymous' 
                    onLoad={handleColorThief} 
                    className='collectionHeader__img' 
                    src={ whichPicture(collection.images, 'med') } />
                </animated.div> 

                <animated.h1 style={{
                    transform: headerAni.scaleUp.to( scaleUp => `scaleY(${ scaleUp *1.1 })`),
                    opacity: headerAni.fadeOut.to( fadeOut => fadeOut )
                }}> 
                { collection.name } 
                </animated.h1>
                
                <animated.div
                style={{
                    transform: headerAni.scaleUp.to( scaleUp => `scaleY(${ scaleUp *1.1 })`),
                    opacity: headerAni.fadeOut.to( fadeOut => fadeOut )
                }} 
                className='collectionHeader__artists'>
                {
                    artists &&
                    artists.length === 1 ?
                    <img
                    height='32px'
                    width='32px' 
                    src={ whichPicture(artists[0].images, 'sm' ) } 
                    alt='Artist' /> :
                    null
                }
                    <p onClick={
                        (e) => handleViewArtist( e, artists, setOverlay, setActiveItem ) }>
                        { artists.map((artist, i) =>  (
                            i !== artists.length - 1 ? 
                            `${ artist.name ? artist.name : artist.display_name }, ` : 
                            `${ artist.name ? artist.name : artist.display_name }` 
                        ))
                        }
                        </p>

                </animated.div> 

                <animated.div 
                style={{
                    transform: headerAni.scaleUp.to( scaleUp => `scaleY(${ scaleUp })`),
                    opacity: headerAni.fadeOut.to( fadeOut => fadeOut )
                }}
                className='collectionHeader__info'>
                    <span>
                        {/* Ternary operators determine if this is a playlist or an album. */}
                        { collection.type === 'playlist' ? `${collection.followers.total} followers` : capital( collection.album_type ) }  
                    </span>
                    {
                        collection.type ==='playlist' ?
                        <p> 
                            { collection.description }
                        </p> :
                        <>
                            <i className="fas fa-dot-circle"></i>
                            <span>
                            { collection.release_date.substr(0,4) }
                            </span>
                        </> 

                    }
                    
                </animated.div>  
                
            </animated.header>
        </>

    )   
}

export default CollectionHeader
