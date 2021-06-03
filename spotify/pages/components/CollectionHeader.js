import { useSpring, animated } from 'react-spring'
import { useLayoutEffect, useEffect, useState, useRef, useContext } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { handleViewArtist } from '../../utils/handleViewArtist'
import { capital } from '../../utils/capital'
import { handleColorThief } from '../../utils/handleColorThief'
import { calcScroll } from '../../utils/calcScroll'
import HeaderBacking from './HeaderBacking'
import { DbHookContext } from './Dashboard'

const CollectionHeader = ({ data }) => {
    const { collection, artists, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ scrolled, setScrolled ] = useState(null)
    const [ fullHeader, setFullHeader ] = useState(true)

    const { setOverlay, setActiveItem, headerMounted, setHeaderMounted, scrollPosition } = useContext( DbHookContext )

    useLayoutEffect(() => {
        const thisHeader = document.querySelector('.collectionHeader')
        document.documentElement.style.setProperty('--headerHeight', thisHeader.offsetHeight + 'px')
        setElementHeight(thisHeader.offsetHeight)

        return () => {
            document.documentElement.style.setProperty('--headerColor0', 'initial')
            document.documentElement.style.setProperty('--headerColor1', 'initial')
        }
    }, [])

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

    const finishMount = (e, amount)=>{
        const colors = handleColorThief(e.target, amount)
        colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${i}`, clr))
        setHeaderMounted(true)
    }

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
            collection={ collection }
            headerMounted={ headerMounted }
             />          
            <animated.header 
            className={`collectionHeader ${headerMounted && 'collectionHeader--active' }`}>
                
                <animated.div
                    style={{
                        transform: scaleDown.to( scaleDown => `scale(${scaleDown}) `),
                        opacity: fadeOut.to( fadeOut => fadeOut )
                    }} 
                    className='collectionHeader__imgContainer'>
                    <animated.div 
                    style={{
                        transform: moveDown.to( moveDown => `translateY(${ moveDown }%)`)
                    }}
                    className='collectionHeader__imgTransform'>
                        <img
                        crossorigin='anonymous' 
                        // ON LOAD HERE ########################################
                        onLoad={(e) => finishMount(e, 2)} 
                        className='collectionHeader__img' 
                        src={ whichPicture(collection.images, 'med') } />
                    </animated.div>
                    
                </animated.div> 

                <animated.h1 style={{
                    opacity: fadeOut.to( fadeOut => fadeOut ),                  
                }}> 
                { collection.name } 
                </animated.h1>
                
                <animated.div
                    style={{
                        opacity: fadeOut.to( fadeOut => fadeOut ),
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
                    opacity: fadeOut.to( fadeOut => fadeOut )
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
