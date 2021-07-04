import { useState, useEffect, useRef, useContext } from 'react'
import { useSpring, animated } from 'react-spring'
import SearchFilters from './SearchFilters'
import SearchResults from './SearchResults'
import useApiCall from '../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { DbFetchedContext } from './Dashboard'

const SearchOverlay = ({ searchState, setSearchState }) => {

    const API = 'https://api.spotify.com/'
    const route = 'v1/search'
    const [ searchInput, setSearchInput ] = useState('')
    const [ activeFilter, setActiveFilter ] = useState( 'top' )
    const [ personalResult, setPersonalResult ] = useState( {} )
    const [ artistResults, setArtistResults ] = useState([])
    const [ albumResults, setAlbumResults ] = useState([])
    const [ playlistResults, setPlaylistResults ] = useState([])
    const [ trackResults, setTrackResults ] = useState([])
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { my_top_artists, my_top_tracks } = useContext( DbFetchedContext )
    const searchBarRef = useRef()
    
    const overlayActive = useSpring({
        opacity: searchState === 'search' ? 1 : 0,
        pointerEvents: searchState === 'search' ?  'auto ': 'none'
    })

    useEffect(() => {
        if(searchState === 'search') searchBarRef.current.focus()

    }, [ searchState ])

    useEffect(() => {
        if(searchInput !== ''){
            setActiveFilter( 'top' )
            finalizeRoute('get', 
            `${ route }`, 
            fetchApi, 
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
            if( apiPayload.artists ) setArtistResults( apiPayload.albums.items )
            if( apiPayload.albums ) setAlbumResults( apiPayload.albums.items )
            if( apiPayload.playlists ) setPlaylistResults( apiPayload.playlists.items )
            if( apiPayload.tracks ) setTrackResults( apiPayload.tracks.items.sort(( a, b ) => b.popularity - a.popularity) )
        }
    }, [ apiPayload ])

    useEffect(() => {
        if(artistResults.length > 0){
            const featArtist = my_top_artists.find( x => x.name.substr(0, searchInput.length).toLowerCase() === searchInput.toLowerCase())
            if( featArtist ){
                setPersonalResult( featArtist )
            } else {
                setPersonalResult( {} )
            }
        }
    }, [ artistResults ])

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
            <SearchResults />
            }

        </animated.div>
    )
}

export default SearchOverlay