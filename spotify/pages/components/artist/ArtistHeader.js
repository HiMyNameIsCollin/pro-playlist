import { useState, useEffect, useLayoutEffect, useRef, useContext, useCallback } from 'react'
import { useSpring, animated } from 'react-spring'
import { whichPicture } from '../../../utils/whichPicture'
import { handleColorThief } from '../../../utils/handleColorThief'
import { calcScroll } from '../../../utils/calcScroll'
import { DbHookContext } from '../Dashboard'
import { DbFetchedContext } from '../Dashboard'
import { SearchPageSettingsContext } from '../search/Search'
import { HomePageSettingsContext } from '../Home'
import useApiCall from '../../hooks/useApiCall'

const ArtistHeader = ({ pageType, data, setHeaderMounted }) => {

    const { collection, artist, tracks } = { ...data }
    const [ colors, setColors ] = useState( undefined )
    const [ elementHeight, setElementHeight ] = useState(null)
    const [ followed, setFollowed ] = useState( false ) 
    const thisHeaderRef = useRef()
    const transitionCompleteRef = useRef() 
    const headerImageRef = useRef()
    const intervalRef = useRef( 0 )

    const { scrollPosition, setActiveManageItem, setDashboardState } = useContext( DbHookContext )
    const { followed_artists } = useContext( DbFetchedContext )
    const { transitionComplete, setTransitionComplete, setActiveHeader, headerScrolled, setHeaderScrolled } = useContext( pageType ==='search' ? SearchPageSettingsContext : HomePageSettingsContext)

    const headerImageRefCb = useCallback( node => {
        if( headerImageRef.current ){
        }
        if( node ){
            headerImageRef.current = node 
            waitForMount()
        }
    },[])

    const waitForMount = () => {
        const img = headerImageRef.current
        const isLoaded = img.complete && img.naturalHeight !== 0
        if( isLoaded ){
            const theseColors = handleColorThief( img, 2 )
            setColors( theseColors )
        } else {
            if(intervalRef.current <=5 ){
                setTimeout( waitForMount, 1000 ) 
                intervalRef.current += 1 
            } else {
                setHeaderMounted( 'error' )
            }
        }
    }

    useEffect(() => {
        if(transitionComplete) {
            transitionCompleteRef.current = true 
        }
        if(colors && transitionCompleteRef.current ) {

            setTimeout(() => {

                setTransitionComplete(false)
                colors.map((clr, i) => document.documentElement.style.setProperty(`--headerColor${pageType}${i}`, clr))
                setActiveHeader( {data : artist.name} )
                setHeaderMounted( true )
            }, 1000)

        }

        return () => setActiveHeader( {} )
    },[ transitionComplete, colors ])

    useEffect(() => {
        const following = followed_artists.find( x => x.name === artist.name )
        if(following) setFollowed(true)
    }, [ followed_artists ])
    
    useLayoutEffect(() => {
        const headerHeight = thisHeaderRef.current.getBoundingClientRect().height
        setElementHeight( headerHeight )
    },[])

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

    const handleMngBtn = () => {
        setActiveManageItem( artist )
        setTimeout( () => setDashboardState('manage'), 250 )
    }

    return(
        <header 
        ref={ thisHeaderRef }
        className={ `artistHeader`}>
            <div className={`headerBacking headerBacking--${pageType}`}></div>
                <div className='artistHeader__imgContainer'>
                <animated.img 
                ref={ headerImageRefCb }
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

                {/* {
                    followed ?
                    <button onClick={ handleFollow } className='artistHeader__info__btn artistHeader__info__btn--active'> Following </button> :
                    <button onClick={ handleFollow } className='artistHeader__info__btn'> Follow </button>
                }
                <i className="fas fa-ellipsis-h"></i> */}
                <button onClick={ handleMngBtn } className='openMngBtn'>
                    Open in manager
                </button>

                {
                    followed &&
                    <p className='artistHeader__info__followed'> Followed </p>
                }
            </div>
        </header>  
         
    )

}

export default ArtistHeader