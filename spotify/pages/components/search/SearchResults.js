import { useState, useEffect, useContext } from 'react'
import RecommendCard from './RecommendCard'
import ResultCard from './ResultCard'
import { DbFetchedContext } from '../Dashboard'


const SearchResults = ({ setActiveItem, activeFilter, searchInput, artistResults, albumResults, trackResults, playlistResults, payload}) => {

    const [ personalResult, setPersonalResult ] = useState( {} )
    const [ results, setResults ] = useState( [] )
    const { my_top_artists, my_top_tracks, followed_artists, currPlaying } = useContext( DbFetchedContext )


    useEffect(() => {
        if(artistResults.length > 0){
            const featArtist = [ ...my_top_artists, ...followed_artists ].find( x => x.name.substr(0, searchInput.length).toLowerCase() === searchInput.toLowerCase())
            if( featArtist ){
                setPersonalResult( featArtist )
            } else {
                setPersonalResult( {} )
            }
        } else {
            setPersonalResult( {} )
        }
    }, [ artistResults ])

    useEffect(() => {
        if( activeFilter === 'Top' ) setResults( [ ...artistResults.slice(0, 2), ...albumResults.slice(0, 2), ...trackResults.slice(0, 2), ...playlistResults.slice(0, 2) ].sort(( a, b ) => Math.random() - 0.5 ) )
        if( activeFilter === 'Artists') setResults( artistResults )
        if( activeFilter === 'Albums') setResults( albumResults )
        if( activeFilter === 'Playlists') setResults( playlistResults )
        if( activeFilter === 'Tracks') setResults( trackResults )
        if( searchInput.length < 1  ) setResults( [] )
    }, [ activeFilter, searchInput, payload ])


    return(
        <div className='searchResultsContainer'>
            {
                albumResults[0] || artistResults[0] || trackResults[0] || playlistResults[0] ?
                <>
                {
                personalResult.images && activeFilter === 'Top' &&
                <RecommendCard setActiveItem={ setActiveItem } data={ personalResult } />    
                }
                {
                results.map( res => <ResultCard  setActiveItem={ setActiveItem } data={ res } />)
                }
                
                </>
                :
                <div className='searchOverlay__defaultMsg'>
                    <p>
                        Find what you love
                    </p>
                    <p>
                        Search for artists, tracks, playlists and albums.
                    </p>
                </div>
            }
            
            
        </div>
    )
}
export default SearchResults