import { useState, useEffect, useContext } from 'react'
import { animated } from 'react-spring'
import SearchForm from './SearchForm'

import SearchFilters from './SearchFilters'
import SearchResults from './SearchResults'
import useApiCall from '../../hooks/useApiCall'
import { DbHookContext } from '../Dashboard'

const SearchOverlay = ({ style, setActiveItem, searchState, setSearchState }) => {

    const route = 'v1/search'
    const [ searchInput, setSearchInput ] = useState('Search')
    const [ activeFilter, setActiveFilter ] = useState( 'Top' )

    const [ artistResults, setArtistResults ] = useState([])
    const [ albumResults, setAlbumResults ] = useState([])
    const [ playlistResults, setPlaylistResults ] = useState([])
    const [ trackResults, setTrackResults ] = useState([])
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall()

    const { hiddenUI, setHiddenUI } = useContext( DbHookContext )

    useEffect(() => {
        if( hiddenUI ) setHiddenUI( false )
    },[])

    useEffect(() => {
        if(searchInput.length > 0 && searchInput !== 'Search'){
            finalizeRoute('get', 
            `${ route }`, 
            null, 
            null,
            null,
            `q=${searchInput}`, 
            `type=album,artist,playlist,track` )
        } else {
            if( artistResults[0] ) setArtistResults( [] )
            if( albumResults[0] ) setAlbumResults( [] )
            if( playlistResults[0] ) setPlaylistResults( [] )
            if( trackResults[0] ) setTrackResults( [] )
        }
    },[ searchInput ])

    useEffect(() => {
        if( apiPayload && searchInput.length > 0 ){
            if( apiPayload.artists ) setArtistResults( apiPayload.artists.items )
            if( apiPayload.albums ) setAlbumResults( apiPayload.albums.items )
            if( apiPayload.playlists ) setPlaylistResults( apiPayload.playlists.items )
            if( apiPayload.tracks ) setTrackResults( apiPayload.tracks.items.sort(( a, b ) => b.popularity - a.popularity) )
        }
    }, [ apiPayload, searchInput ])



    return(
        <animated.div style={ style } className='searchOverlay'>
            
            <header className='searchOverlay__header'>
                <SearchForm searchInput={ searchInput } setSearchInput={ setSearchInput } autoFocus={ true } />
                <button className='searchOverlay__header__button' onClick={ () => setSearchState('default')}> Back </button>
                {
                searchInput.length !== 0 &&
                <SearchFilters activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>
                }
            </header>

            
            <SearchResults
            payload={ apiPayload }
            activeFilter={ activeFilter }
            searchInput={ searchInput }
            albumResults={ albumResults }
            artistResults={ artistResults }
            trackResults={ trackResults }
            playlistResults={ playlistResults }
            setActiveItem={ setActiveItem } />
            

        </animated.div>
    )
}

export default SearchOverlay