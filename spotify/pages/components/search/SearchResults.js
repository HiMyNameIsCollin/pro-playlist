import { useState, useEffect, useContext } from 'react'
import RecommendCard from './RecommendCard'
import ResultCard from './ResultCard'
import { DbFetchedContext } from '../Dashboard'


const SearchResults = ({ activeFilter, searchInput, artistResults, albumResults, trackResults, playlistResults }) => {

    const [ personalResult, setPersonalResult ] = useState( {} )
    const [ results, setResults ] = useState( [] )
    const { my_top_artists, my_top_tracks, followed_artists } = useContext( DbFetchedContext )

    useEffect(() => {
        if(artistResults.length > 0){
            const featArtist = [ ...my_top_artists, ...followed_artists ].find( x => x.name.substr(0, searchInput.length).toLowerCase() === searchInput.toLowerCase())
            if( featArtist ){
                setPersonalResult( featArtist )
            } else {
                setPersonalResult( {} )
            }
        }
    }, [ artistResults ])

    useEffect(() => {
        if( activeFilter === 'Top' ) setResults( [ ...artistResults.slice(0, 2), ...albumResults.slice(0, 2), ...trackResults.slice(0, 2), ...playlistResults.slice(0, 2) ].sort(( a, b ) => Math.random() - 0.5 ) )
        if( activeFilter === 'Artists') setResults( artistResults )
        if( activeFilter === 'Albums') setResults( albumResults )
        if( activeFilter === 'Playlists') setResults( playlistResults )
        if( activeFilter === 'Tracks') setResults( trackResults )
        if( searchInput === '' ) setResults( [] )
    }, [ activeFilter, searchInput ])


    return(
        <div className='searchResultsContainer'>
            {
            personalResult.images && activeFilter === 'Top' &&
            <RecommendCard data={ personalResult } />    
            }
            {
            results.map( res => <ResultCard data={ res } />)
            }
        </div>
    )
}
export default SearchResults