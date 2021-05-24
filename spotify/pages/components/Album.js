import { useState, useEffect, useReducer } from 'react'
import  useApiCall  from '../../hooks/useApiCall'
import { whichPicture } from '../../utils/whichPicture'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { handleViewArtist } from '../../utils/handleViewArtist'
import Loading from './Loading'

const routes = {
    album: 'v1/albums',
    tracks: 'v1/albums/tracks',
    main_artist: 'v1/artists',

}

const reducer = (state, action) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method 
    }
    switch(route){
        case routes.album :
            return{
                ...state, 
                album: action
            }
        case routes.main_artist :
            return{
                ...state, 
                main_artist: action
            }
        case routes.tracks :
            return{
                ...state,
                tracks: action.items
            }
        default:
            console.log(action)
            break
    }
}

const Album = ({ item, setActiveItem, overlay, setOverlay, location }) => {
    const initialState = {
        album: item ? item : null ,
        tracks: null,
        main_artist: null
    }
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState(false)
    const { album, main_artist, tracks } = {...state}
    useEffect(() => {
        if( !item ) {
            const id = location.pathname.substr(7)
            finalizeRoute( 'get', `${routes.album}/${id}`, fetchApi)
        }
    }, [])

    useEffect(() => {
        // Set background image of Album header
        if( album ) document.documentElement.style.setProperty('--albumBackground', `url(${whichPicture(album.images, 'lrg')})`) 
    }, [album])

    useEffect(() => {
        if( album && !state.main_artist){
            finalizeRoute( 'get', `${routes.main_artist}/${album.artists[0].id}` , fetchApi )
        } 
    }, [ album ])


    useEffect(() => {
        if( album && !state.tracks){
            let tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 7 )
            tracksRoute += `/${album.id}`
            tracksRoute += '/tracks'
            console.log(tracksRoute)
            finalizeRoute( 'get', tracksRoute , fetchApi , album.id)
        } 
    }, [ album ])

    useEffect(() => {
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])

    // If users first page is Album, fetch the data from here, and then set in the dashboard component.

    useEffect(() => {
        if( !item && album ) setActiveItem( album )
    }, [album])

    const handleTrackMenu = ( selectedTrack ) => {
        const popupData = {
            album, 
            tracks,
            selectedTrack,
        }
        setOverlay( {type: 'trackMenu', data: popupData, func: null} )
    }

    const handleLoading = () => {
        setLoaded(true)
    }

    const calculateAlbumLength = ( tracks ) => {
        let total = 0
        tracks.map((single, i) => {
            total += single.duration_ms
        })
        const msToTime = ( duration ) => {
            let milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            hours = (hours > 0) ? (hours < 10) ? '0' + hours : hours : 0
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            hours = (hours > 0) ? (hours > 1 ) ? hours + ' ' + 'hour' : hours + ' ' + 'hours' : false
            minutes = minutes + ' ' + 'minutes'
            seconds = seconds + ' ' + 'seconds'
            return hours ? hours + minutes + seconds : minutes + seconds
        }
        const albumLength = msToTime(total)
        return albumLength
    }

    return(
        <div className={ `page page--album album ${ overlay ? 'page--blurred' : ''}` }>
            <Loading loaded={ loaded }/>
            {
                album &&
                
                    <header className='album__header'>
                        <div className='album__imgContainer'>
                            <img src={ whichPicture(album.images, 'med') } />
                        </div> 
                        <h1> { album.name } </h1>
                        
                        <div className='album__artists'>
                        {main_artist && 
                        
                            <img
                            onLoad={ handleLoading }
                            height='32px'
                            width='32px' 
                            src={ whichPicture(main_artist.images, 'sm' ) } 
                            alt='Artist' />
                        
                        }
                            <p onClick={ (e) => handleViewArtist( e, album.artists, setOverlay, setActiveItem ) }>{ album.artists.map((artist, i) =>  i !== album.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }` ) }</p>

                    </div> 
                    <div className='album__info'>
                        <span>
                            { capital( album.album_type ) }  
                        </span>
                        ||
                        <span>
                            { album.release_date.substr(0,4) }
                        </span>
                    </div>  
                    </header>          

            }
            {
                tracks &&
                <section className='trackContainer'>
                {
                    tracks.map((track, i) => {
                        return (
                        <div className='track' key={i}>
                            <p>
                                { track.name }
                            </p>
                            <span>
                                { 
                                track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)
                                }
                            </span>
                            <i onClick={ () => handleTrackMenu(track) } className="fas fa-ellipsis-h"></i>

                        </div>
                        ) 
                    })
                }
                </section>
            }
            {
                album && tracks &&
                <section className='album__meta'>
                    <p>
                        { album.release_date }
                    </p>
                    <span>
                        {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                    </span>
                    || 
                    <span>
                        { calculateAlbumLength(tracks) }
                    </span>
                </section>
            }

        </div>
    )
}

export default Album