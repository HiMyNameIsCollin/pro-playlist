import { useState, useEffect, useRef, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import SearchFilters from './SearchFilters'
import SearchResults from './SearchResults'
import useApiCall from '../../hooks/useApiCall'

const SearchOverlay = ({ searchState, setSearchState }) => {

    const API = 'https://api.spotify.com/'
    const route = 'v1/search'
    const [ searchInput, setSearchInput ] = useState('')
    const [ activeFilter, setActiveFilter ] = useState( 'top' )

    const [ artistResults, setArtistResults ] = useState([])
    const [ albumResults, setAlbumResults ] = useState([])
    const [ playlistResults, setPlaylistResults ] = useState([])
    const [ trackResults, setTrackResults ] = useState([])
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const searchBarRef = useRef()
    
    const overlayActive = useSpring({
        opacity: searchState === 'search' ? 1 : 0,
        pointerEvents: searchState === 'search' ?  'auto ': 'none'
    })

    useEffect(() => {
        if( searchState === 'search' ) searchBarRef.current.focus()
        if( searchState !=='search' && searchInput !== '' ) {
            setSearchInput('')
            searchBarRef.current.value = ''
        }
    }, [ searchState ])

    useEffect(() => {
        if(searchInput !== ''){
            setActiveFilter( 'top' )
            finalizeRoute('get', 
            `${ route }`, 
            null, 
            `q=${searchInput}`, 
            `type=album,artist,playlist,track` )
        } else {
            if( artistResults.length ) setArtistResults( [] )
            if( albumResults.length ) setAlbumResults( [] )
            if( playlistResults.length ) setPlaylistResults( [] )
            if( trackResults.length ) setTrackResults( [] )
        }
    },[ searchInput ])

    useEffect(() => {
        if( apiPayload ){
            if( apiPayload.artists ) setArtistResults( apiPayload.artists.items )
            if( apiPayload.albums ) setAlbumResults( apiPayload.albums.items )
            if( apiPayload.playlists ) setPlaylistResults( apiPayload.playlists.items )
            if( apiPayload.tracks ) setTrackResults( apiPayload.tracks.items.sort(( a, b ) => b.popularity - a.popularity) )
        }
    }, [ apiPayload ])


    return(
        <animated.div style={ overlayActive } className='searchOverlay'>
            
            <header className='searchOverlay__header'>
                <form>
                    <i className="fas fa-search"></i>
                    <input ref={ searchBarRef } onChange={ (e) => setSearchInput( e.target.value ) } type='text' placeholder='Search'/>
                </form>
                <button className='searchOverlay__header__button' onClick={ () => setSearchState('default')}> Cancel </button>
                {
                searchInput.length > 0 &&
                <SearchFilters activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>
                }
            </header>

            {
            !artistResults.length &&
            !albumResults.length &&
            !playlistResults.length &&
            !trackResults.length ?
            <div className='searchOverlay__defaultMsg'>
                <h1>
                    Find what you love
                </h1>
                <p>
                    Search for artists, tracks, playlists and albums.
                </p>
            </div> :
            <SearchResults
            activeFilter={ activeFilter }
            searchInput={ searchInput }
            albumResults={ albumResults }
            artistResults={ artistResults }
            trackResults={ trackResults }
            playlistResults={ playlistResults } />
            }

        </animated.div>
    )
}

export default SearchOverlay