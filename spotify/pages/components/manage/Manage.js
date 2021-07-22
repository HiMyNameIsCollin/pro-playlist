import { useEffect, useState, useContext, useReducer, useRef, createContext } from 'react'
import { useSprings, animated } from 'react-spring'
import useApiCall from '../../hooks/useApiCall'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import ManageFilters from './ManageFilters'
import ManageContainer from './ManageContainer'
import ManageOverlay from './ManageOverlay'
import SearchOverlay from '../search/SearchOverlay'

export const ManageHookContext = createContext()

const Manage = ({ manageState, setManageState }) => {

    const thisComponentRef = useRef()
    const manageContainerListTypeRef = useRef( 'bar' )
    const totalLikedSongsRef = useRef(0)

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ data, setData ] = useState( [] )
    const [ activeManageItem, setActiveManageItem ] = useState( {} ) 
    const [ likedPlaylist, setLikedPlaylist ] = useState()
    const [ activeFilter, setActiveFilter ] = useState( undefined )
    const [ subFilter, setSubFilter ] = useState( false )
    const [ sort , setSort ] = useState( 'Recently added' )
    const [ manageOverlay, setManageOverlay ] = useState( { type: undefined } )
    const [ transitionComplete, setTransitionComplete ] = useState( false )

    const sortFilters = [ 'Recently added', 'Alphabetical', 'Creator' ]
    const { user_info, my_albums, my_playlists, followed_artists, my_liked_tracks, recently_played } = useContext( DbFetchedContext )

    const manageHookState = {
        activeManageItem,
        setActiveManageItem
    }

    useEffect(() => {
        if( apiPayload ) console.log(apiPayload)
    }, [ apiPayload ])


    useEffect(() => {
        if( my_liked_tracks.length > 0 && my_liked_tracks.length >= totalLikedSongsRef.current){
            if( !likedPlaylist ) createLikedTracksPlaylist( my_liked_tracks )
            if( likedPlaylist ) addToLikedTracksPlaylist( my_liked_tracks )
            totalLikedSongsRef.current = my_liked_tracks.length
        }
    }, [ my_liked_tracks ])
    
    useEffect(() => {
        if( activeFilter === 'playlists' ){
            sortByFilter( my_playlists )
        } else if( activeFilter === 'artists' ){
            sortByFilter( followed_artists )
        } else if( activeFilter === 'albums' ){
            sortByFilter( my_albums )
        } else if( !activeFilter ){
            sortByFilter( [ ...my_albums, ...my_playlists, ...followed_artists ] )
        }
    }, [activeFilter, subFilter, sort])

    useEffect(() => {
        if( manageOverlay.type ) setManageOverlay({ type: undefined })
    }, [ sort ])

    useEffect(() => {
        sortByFilter( [ ...my_albums, ...my_playlists, ...followed_artists ] )
    }, [ my_albums, my_playlists, followed_artists ])

    const createLikedTracksPlaylist = ( liked_tracks ) => {
        
        let likedTracks = {
            name: 'Liked Tracks',
            description: 'Your favorite songs',
            tracks: liked_tracks,
            type: 'Playlist'
        }
        likedTracks['images'] = liked_tracks[0].album.images
        setLikedPlaylist( likedTracks )
    }

    const addToLikedTracksPlaylist = ( liked_tracks ) => {
        let likedPlaylistClone = { ...likedPlaylist } 
        likedPlaylistClone.tracks = [ ...likedPlaylistClone.tracks, ...liked_tracks.slice( totalLikedSongsRef.current ) ]
        setLikedPlaylist( likedPlaylistClone)
    }

    const sortByFilter = ( arr ) => {
        let sorted = []
        if( sort === sortFilters[0] ){
            sorted = arr
        } else if ( sort === sortFilters[1] ){
            sorted = arr.sort(( a, b ) => a.name.localeCompare( b.name ) )
        } else if ( sort === sortFilters[2] ) {
            sorted = arr.sort(( a, b ) => {
                const aVal = findName( a )
                const bVal = findName( b ) 
                if( aVal < bVal ) return -1
                if( bVal < aVal ) return 1
             })
        } 
        setData( sorted )
    }

    const findName = ( obj ) => {
        let result
        if( obj.artists ){
            result = obj.artists[0].name
        } else if( obj.owner ){
            result = obj.owner.display_name
        } else if( obj.name ){
            result = obj.name
        }
        return result
    }

    return(
        <ManageHookContext.Provider value={ manageHookState }>
            <>
            <ManageOverlay 
            sortFilters={ sortFilters } 
            setSort={ setSort } 
            data={ manageOverlay }
            setData={ setManageOverlay } />

            <SearchOverlay type={'manage'} searchState={ manageState } setSearchState={ setManageState } />

            <div id='managePage' style={{ position: 'absolute '}} className={ `page page--manage`}>
                <header className='manageHeader'>
                    <div className='manageHeader__top'>
                        <div className='manageHeader__imgContainer'>
                        {
                        user_info.images &&
                        <img src={ user_info.images[0].url } alt={ `${ user_info.display_name }'s profile photo `} />
                        }
                        </div>
                        <h1 className='manageHeader__title'>
                            Manage
                        </h1>
                        <i 
                        onClick={ () => setManageState( 'search' ) }
                        className="fas fa-search"></i>
                        <i className="fas fa-plus"></i>
                    </div>
                    <ManageFilters 
                    activeFilter={ activeFilter } 
                    setActiveFilter={ setActiveFilter } 
                    subFilter={ subFilter } 
                    setSubFilter={ setSubFilter }/>
                </header>

                <ManageContainer 
                transitionComplete={ transitionComplete }
                setTransitionComplete={ setTransitionComplete }
                setManageOverlay={ setManageOverlay }
                sort={ sort }
                data={ data }
                likedPlaylist={ likedPlaylist }
                manageContainerListTypeRef={ manageContainerListTypeRef }/> 
            </div>
            </>
        </ManageHookContext.Provider>
    )
}

export default Manage