import { useState, useEffect, useReducer , useLayoutEffect, useContext} from 'react'
import TracksContainer from './TracksContainer'
import useApiCall from '../../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'

const Artist = ({ genreSeeds, location }) => {

    const { activeItem, setActiveItem, overlay, setOverlay, setActiveHeader, headerMounted } = useContext( DbHookContext )

    const initialState = {
        artist: [],
        top_tracks: [],
        artistAlbums: [],
        albumsFull: [],
        follow: false,
    }

    const routes = {
        artist: 'v1/artists',
        top_tracks: 'v1/artists/top-tracks',
        artistAlbums: 'v1/artists/albums',
        following: 'v1/me/following/contains',
        albumsFull: 'v1/albums'
    }

    const reducer = ( state, action ) => {
        let route
        let method
        if(action){
            route = action.route
            method = action.method 
        }
        switch(route){
            case routes.artist :
                return {
                    ...state,
                    artist: action
                }
            case routes.top_tracks :
                return {
                    ...state,
                    top_tracks: action.tracks
                }
            case routes.artistAlbums :
                const ids = action.items.map(album => album.id)
                const multiCall = ( arr, limit ) => {
                    const makeCall = ( arr ) => {
                        finalizeRoute('get', `${routes.albumsFull}`, fetchApi, null, `ids=${ [ ...arr ] }`)
                    }
                    if( arr.length > limit ){
                        makeCall( arr.slice( 0, limit ) )
                        arr.splice( 0, limit )
                        multiCall( arr, limit)
                    } else {
                        makeCall( arr )
                    }
                }
                multiCall(ids, 20)
                return {
                    ...state,
                    albums: action.items
                }
            case routes.albumsFull :
                console.log(action)
                return{
                    ...state,
                    albumsFull: [...state.albumsFull, ...action.albums]
                }
            case routes.following :
                return {
                    ...state,
                    following: action[0]
                }
            default: 
                console.log(action)
                break
        }

    }

    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState(false)
    const [ elementHeight, setElementHeight ] = useState(null)
    const { artist , top_tracks } = { ...state }


    useEffect(() => {
        let id = activeItem && activeItem.id ? activeItem.id : location.pathname.substr( routes.artist.length - 2 )
        finalizeRoute( 'get', `${routes.artist}/${id}`, fetchApi, id)
        finalizeRoute( 'get', `${routes.artist}/${id}/top-tracks`, fetchApi, id, `market=ES`)
        finalizeRoute( 'get', `${routes.artist}/${id}/albums`, fetchApi, id, 'limit=50')
    }, [])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[ apiPayload ])

    useEffect(() => {
        if(artist.id && !activeItem) setActiveItem(artist)
    },[ artist ])

    useLayoutEffect(() => {
        if(artist.id ){
            const thisHeader = document.querySelector('.artistHeader')
            document.documentElement.style.setProperty('--headerHeight', thisHeader.offsetHeight + 'px')
            setElementHeight(thisHeader.offsetHeight)
    
            return () => {
                document.documentElement.style.setProperty('--headerColor0', 'initial')
                document.documentElement.style.setProperty('--headerColor1', 'initial')
            }
        }
    }, [artist])

    const loadLoader = useTransition(loaded, {
        from: { opacity: 0 } ,
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })

    const Loader = loadLoader((style, item) => {
         return <animated.div style={style}> <Loading/> </animated.div>
    })

    return(
        <div className={ `page page--artist artist ${ overlay ? 'page--blurred' : ''}` }>
            {
                artist.images &&
                <header className='artistHeader'>
                    <div className='artistHeader__imgContainer'>
                        <img 
                        src={ whichPicture(artist.images, 'lrg') }
                        alt='Artist'
                        /> 
                    </div>
                    <h1> {artist.name} </h1>
                </header>
            }
            {
                top_tracks[0] &&
                <TracksContainer type='artist' data={ {collection: null, tracks: top_tracks.slice(0, 5)} } setOverlay={ setOverlay }/>
            }
        </div>
    )
}

export default Artist