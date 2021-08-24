import { useState, useEffect, useLayoutEffect, useRef, useContext, useCallback } from 'react'
import { useSpring, animated } from 'react-spring'
import useApiCall from '../hooks/useApiCall'
import { whichPicture } from '../../utils/whichPicture'
import { handleColorThief } from '../../utils/handleColorThief'
import { calcScroll } from '../../utils/calcScroll'
import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'

const routes = {
    followed_artists: 'v1/me/following'
}

const ArtistHeader = ({ pageType, data, transitionComplete, setTransitionComplete, headerScrolled, setHeaderScrolled, activeHeader, setActiveHeader, parent }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )

    const { collection, artist, tracks } = { ...data }
    const [ colors, setColors ] = useState( undefined )
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ followed, setFollowed ] = useState( false ) 
    const thisHeaderRef = useRef()
    const { scrollPosition } = useContext( DbHookContext )
    const { followed_artists } = useContext( DbFetchedContext )

    const getColors = ( e ) => {
        const theseColors = handleColorThief( e.target, 2 )
        setColors( theseColors )
    }

    useEffect(() => {
        if(colors && transitionComplete ) {
            setTransitionComplete(false)
            colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${pageType}${i}`, clr))
            parent.classList.add('fadeIn')
            parent.style.minHeight = '100vh'
        }
    },[ transitionComplete, colors ])

    useEffect(() => {
        const following = followed_artists.find( x => x.name === artist.name )
        if(following) setFollowed(true)
    }, [ followed_artists ])
    
    useLayoutEffect(() => {
        setHeaderScrolled( 0 )
        const headerHeight = thisHeaderRef.current.getBoundingClientRect().height
        setElementHeight( headerHeight )
        setActiveHeader({ data: artist.name })
    },[])

    const handleFollow = () => {
        // finalizeRoute('PUT', routes.followed_artists, artist.id, null, null, 'type=artist', `ids=${ artist.id }`)
        console.log( 'I dont think this route works... https://developer.spotify.com/console/put-following/?type=artist&ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6 doesnt work either')
    }

    useEffect(() => {
        if( apiPayload ) console.log(apiPayload)
    },[ apiPayload ])

    useEffect(() => {
        const percent = calcScroll( elementHeight )
        setHeaderScrolled( percent <= 100 ? percent : 100 )
    }, [scrollPosition , elementHeight])


    const { fadeOut, imgSlide } = useSpring({
        to: {
            fadeOut: `${ 1 - ( headerScrolled * 0.02 )}`,
            imgSlide: headerScrolled + 20 <= 100 ? ( headerScrolled + 20 ) : 100
        },
        config: {
            precision: 1,
        }
    })

    return(
        <header 
        ref={ thisHeaderRef }
        className={ `artistHeader`}>
            <div className={`headerBacking headerBacking--${pageType}`}></div>
                <div className='artistHeader__imgContainer'>
                <animated.img 
                onLoad={ getColors }
                style={{ objectPosition: imgSlide.to( t => `0% ${t}%` ) }}
                crossOrigin='anonymous' 
                src={ artist.images.length > 0 ? whichPicture(artist.images, 'lrg') : '//logo.clearbit.com/spotify.com' }
                alt='Artist'/> 
                <animated.p 
                className='artistHeader__title'
                style={{
                    opacity: fadeOut.to( o => o ),
                }}> {artist.name} </animated.p>
            </div>
            <div className='artistHeader__info'>
                <p> { artist.followers.total } followers </p>
                {
                    followed ?
                    <button onClick={ handleFollow } className='artistHeader__info__btn artistHeader__info__btn--active'> Following </button> :
                    <button onClick={ handleFollow } className='artistHeader__info__btn'> Follow </button>
                }
                {/* <i className="fas fa-ellipsis-h"></i> */}
            </div>
        </header>  
         
    )

}

export default ArtistHeader