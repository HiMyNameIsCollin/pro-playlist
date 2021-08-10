import { useSpring, animated } from 'react-spring'
import { useLayoutEffect, useEffect, useState, useRef, useContext, useCallback } from 'react'
import { capital } from '../../utils/capital'
import { whichPicture } from '../../utils/whichPicture'
import { handleColorThief } from '../../utils/handleColorThief'
import { calcScroll } from '../../utils/calcScroll'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'

const CollectionHeader = ({ pageType, data, transitionComplete, headerScrolled, setHeaderScrolled, setActiveItem, setActiveHeader }) => {
    const { collection, artists, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ backgroundImage, setBackgroundImage ] = useState(null)
    const thisHeaderRef = useRef()

    const { setOverlay, scrollPosition, } = useContext( DbHookContext )

    const thisComponentImage = useCallback(node => {
        if (node !== null && transitionComplete) {
            const image = node
            const colors = handleColorThief(image, 2)
            colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${pageType}${i}`, clr))
        }
      }, [ transitionComplete ])

    useLayoutEffect(() => {
        const headerHeight = thisHeaderRef.current.getBoundingClientRect().height
        setElementHeight(headerHeight)
        const img = whichPicture(collection.images, 'lrg')
        setBackgroundImage( img )
        setActiveHeader( {data : collection.name} )
        return () => {
            setBackgroundImage(null)
            setHeaderScrolled( 0 )
        }
    }, [])

    useEffect(() => {
        const percent = calcScroll( elementHeight )
        setHeaderScrolled( percent <= 100 ? percent : 100 )
    }, [scrollPosition , elementHeight])

    const {scaleDown, fadeOut, moveDown} = useSpring({
        to: {
            scaleDown: `${ 1.00 - ( headerScrolled * 0.005 )  }`,
            fadeOut: `${ 1 - ( headerScrolled * 0.02 )}`,
            moveDown: `${ ( headerScrolled * 2 )  }`
        },
        config: {
            precision: 1,
        }
    })

    const handleViewArtist = (e) => {
        e.stopPropagation()
        if( collection.artists ){
            // TEMPORARY FIX TO PREVENT CLICKING ON PLAYLIST OWNERS NAME
            if( collection.artists.length === 1 ){
                setActiveItem( collection.artists[0] )
            } else {
                const calledFrom = pageType
                setOverlay( {type: 'collection', calledFrom: calledFrom, page: pageType, data: { artists: collection.artists }} )
            }
        }
    }

    return(
            <header 
            ref={ thisHeaderRef }
            className={`collectionHeader`}>
                <div className={`headerBacking headerBacking--${pageType}`} 
                style={{backgroundImage: `url(${backgroundImage})`}}></div>
                
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
                        ref={ thisComponentImage }
                        className='collectionHeader__img' 
                        src={ whichPicture(collection.images, 'med') } />
                    </animated.div>
                </animated.div> 

                <animated.p
                className='collectionHeader__title' 
                style={{
                    opacity: fadeOut.to( fadeOut => fadeOut ),                  
                }}> 
                { collection.name } 
                </animated.p>
                
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
                        (e) => handleViewArtist(e) }>
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

            </header>
        

    )   
}

export default CollectionHeader
