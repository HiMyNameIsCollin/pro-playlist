import { useState, useEffect, useReducer , useLayoutEffect, useContext} from 'react'
import TracksContainer from './TracksContainer'
import Loading from './Loading'
import AlbumContainer from './AlbumContainer'
import ArtistHeader from './ArtistHeader'
import Slider from './Slider'
import useApiCall from '../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'
const Artist = ({ headerScrolled, setHeaderScrolled, genreSeeds, activeHeader, setActiveHeader }) => {


    const {  overlay, setOverlay, activeHomeItem, setActiveHomeItem, location } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext )
    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem


    const initialState = {
        artist: {},
        top_tracks: [],
        artistAlbums: [],
        all_albums: [],
        follow: false,
        related_artists: []
    }

    const routes = {
        artist: 'v1/artists',
        top_tracks: 'v1/artists/top-tracks',
        artistAlbums: 'v1/artists/albums',
        following: 'v1/me/following/contains',
        all_albums: 'v1/albums',
        related_artists: 'v1/artists/related-artists'
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
                        finalizeRoute('get', `${routes.all_albums}`, fetchApi, null, `ids=${ [ ...arr ] }`)
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
            case routes.all_albums :
                console.log(action)
                return{
                    ...state,
                    all_albums: [...state.all_albums, ...action.albums]
                }
            case routes.following :
                return {
                    ...state,
                    following: action[0]
                }
            case routes.related_artists:
                return{
                    ...state,
                    related_artists: action.artists
                }
            default: 
                console.log(action)
                break
        }
    }
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)

    const { artist , top_tracks, all_albums, related_artists } = { ...state }

    useEffect(() => {
        let id = activeItem && activeItem.id ? activeItem.id : location.pathname.substr( routes.artist.length - 2 )
        finalizeRoute( 'get', `${routes.artist}/${id}`, fetchApi, id)
        finalizeRoute( 'get', `${routes.artist}/${id}/top-tracks`, fetchApi, id, `market=ES`)
        finalizeRoute( 'get', `${routes.artist}/${id}/albums`, fetchApi, id, 'limit=50')
        finalizeRoute( 'get', `${routes.artist}/${id}/related-artists`, fetchApi, id, 'limit=50')

    }, [])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[ apiPayload ])

    useEffect(() => {
        if(artist.id && !activeItem) setActiveItem(artist)
    },[ artist ])

    useEffect(() => {
        if(artist.id && !activeHeader){
            setActiveHeader({ artist })
        }
    }, [ artist ])


    return(
        <div className={ `page page--artist artist ${ overlay.type && 'page--blurred' } ` }>
            {
                artist.id &&
                <ArtistHeader 
                pageType={ searchContext ? 'Search' : 'Home'}
                headerScrolled={ headerScrolled }
                setHeaderScrolled={ setHeaderScrolled }
                activeHeader={ activeHeader }
                setActiveHeader={ setActiveHeader }
                data={{ artist }} />
            }

                
                <TracksContainer type='artist' data={ {collection: null, tracks: top_tracks, artist: artist} } setOverlay={ setOverlay }/>
                <AlbumContainer type='artist--page' albums={ all_albums } />
                <Slider 
                message='Fans also enjoy'
                items={ related_artists }
                setActiveItem={ setActiveItem } />
        
        </div>
    )
}

export default Artist