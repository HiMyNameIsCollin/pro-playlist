import { useContext, useEffect, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import SelectOverlayHeader from './SelectOverlayHeader'
import MenuCard from './MenuCard'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import useApiCall from '../../hooks/useApiCall'

const TrackRecommendationsMenu = ({ menuData, pos }) => {

   

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setMessageOverlay } = useContext( DbHookContext )
    const { my_liked_tracks, my_top_tracks, available_genre_seeds, my_top_artists } = useContext( DbFetchedContext )
    const alteredPlaylistRef = useRef( {} )
    const tracksAddedRef = useRef( [] )

    const addToPlaylistRoute = 'v1/playlists/tracks'
    const recommendationsRoute = 'v1/recommendations'

    const [ tracks, setTracks ] = useState([])

    useEffect(() => {
        if( apiPayload ) {
            if( apiPayload.route === recommendationsRoute){
                setTracks( apiPayload.tracks )
            } else if( apiPayload.route === addToPlaylistRoute ){
                const { track, playlist } = alteredPlaylistRef.current
                setMessageOverlay( m => m = [ ...m, `${track} added to ${ playlist }`])
                alteredPlaylistRef.current = {}
            }
        }
    }, [ apiPayload ])



    useEffect(() => {
        if( !menuData.data ){
            getTracks( [...my_liked_tracks, ...my_top_tracks ], my_top_artists )
        } else {
            getTracks( menuData.data )
        }
    },[])

    const getTracks = ( tracks, artists ) => {
        const items = tracks.filter(({ id: id1 }) => tracks.filter(({ id: id2 }) =>  id1 === id2 ).length === 1 )
        const seeds = getSeeds( available_genre_seeds, artists, items )
        finalizeRoute('get', `${ recommendationsRoute }`, null, null, null, ...seeds)
    }

    const getSeeds = ( genres , theseArtists, theseTracks ) => {
        let seeds = {
            seedGenres: [],
            seedArtists: [],
            seedTracks: []
        }
        let { seedGenres, seedArtists, seedTracks } = seeds
        theseArtists.forEach(( artist, i ) => {
            artist.genres.forEach(( genre, j ) => {
                if(genres.includes( genre )){
                    if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                    seedGenres.push( genre )
                    }
                }
            })
            if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                seedArtists.push( artist.id )
            }
        })
        theseTracks.forEach( track => {
            if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                seedTracks.push( track.id )
            }
        })
        let args = []
        if(seedGenres.length > 0) args.push( `seed_genres=${seedGenres.join()}` )
        if( seedArtists.length > 0 ) args.push(`seed_artists=${seedArtists.join()}` )
        if( seedTracks.length > 0 ) args.push( `seed_tracks=${seedTracks.join()}` )
        return args
    }

    // const addToPlaylist = ( playlist ) => {
    //     // this ref is for pop up message 
    //     editedPlaylistRef.current = { playlist: playlist.name, track: menuData.data[0].name }
    //     const args = menuData.data.map( it =>  it.uri )
    //     finalizeRoute('post', `${addToPlaylistRoute.slice( 0, 12 ) }/${playlist.id}/tracks`, playlist.id, null, null,  `uris=${args[0]}`, ...args.slice( 1 ) )        
    // }

    const handleAddToPlaylist = ( item ) => {
        alteredPlaylistRef.current = { track: item.name, playlist: menuData.context.name }
        tracksAddedRef.current = [...tracksAddedRef.current, item.id ]
        finalizeRoute('post', `${ addToPlaylistRoute.substr(0, 12) }/${ menuData.context.id }/tracks`, menuData.context.id, null, null, `uris=${ item.uri }`)
    }

    const shrink = useSpring({
        transform: pos >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: pos >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: pos >= selectOverlay.length - 1 ? '85vh' : '100vh'
    })

    return(
        <animated.div style={ shrink } className={ `selectOverlay__menu `} >
            <SelectOverlayHeader menuData={ menuData } />
            <div className='selectOverlay__main'>

                <div className='selectOverlay__scroll'>
                {
                    tracks.map( ( track, i ) => (
                        !tracksAddedRef.current.includes( track.id ) &&
                        <MenuCard 
                        item={ track } 
                        index={ i } 
                        page={ menuData.page } 
                        type={ menuData.type } 
                        tracks={ tracks }
                        menuData={ menuData }
                        handleAddToPlaylist= { handleAddToPlaylist }
                        />
                    ))
                }
                </div>
            </div>
        </animated.div>
    )
}

export default TrackRecommendationsMenu