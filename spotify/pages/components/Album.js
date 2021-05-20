import { useState, useEffect, useReducer } from 'react'
import  useApiCall  from '../../hooks/useApiCall'
import { whichPicture } from '../../utils/whichPicture'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
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
                tracks: action
            }
        default:
            console.log(action)
            break
    }
}

const Album = ({ item, setActiveItem, location }) => {
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
        if( album ) document.documentElement.style.setProperty('--albumBackground', `url(${whichPicture(album.images, 'lrg')})`) 
    }, [album])

    useEffect(() => {
        if( album && !state.main_artist){
            finalizeRoute( 'get', `${routes.main_artist}/${album.artists[0].id}` , fetchApi )
        } 
    }, [ album ])

    useEffect(() => {
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])

    const handleViewArtist = () => {
        if( album.artists.length === 1){
            setActiveItem(album.artists[0])
        }
        
    }

    const handleLoading = () => {
        console.log(123)
        setLoaded(true)
    }

    return(
        <div className='page page--album album'>
            
            <Loading loaded={ loaded }/>
            
            {
                album &&
                <>
                <header className='album__header'>
                    <div className='album__imgContainer'>
                        <img src={ whichPicture(album.images, 'med') } />
                    </div> 
                </header>          
                    
                    
                <div className='album__info'>
                    {main_artist && 
                    <>
                        <h1> { album.name } </h1>
                        <img
                        onLoad={ handleLoading }
                        height='48px'
                        width='48px' 
                        src={ whichPicture(main_artist.images, 'sm' ) } 
                        alt='Artist' />
                        <p onClick={ handleViewArtist }>{ album.artists.map((artist, i) =>  i !== album.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }` ) }</p>
                    </>
                    }
    
                </div>          
                <h3>Test</h3>
                </> 
            }
 
        
        </div>
    )
}

export default Album