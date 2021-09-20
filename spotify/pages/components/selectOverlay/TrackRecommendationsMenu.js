import { useContext, useEffect, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import SelectOverlayHeader from './SelectOverlayHeader'
import MenuCard from './MenuCard'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import { getSeeds } from '../../../utils/getSeeds'

import useApiCall from '../../hooks/useApiCall'

const TrackRecommendationsMenu = ({ menuData, pos }) => {

    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall()
    const { selectOverlay, setMessageOverlay } = useContext( DbHookContext )
    const { my_liked_tracks, my_top_tracks, available_genre_seeds, my_top_artists } = useContext( DbFetchedContext )
    const alteredPlaylistRef = useRef( {} )
    const tracksAddedRef = useRef( [] )

    const addToPlaylistRoute = 'v1/playlists/tracks'
    const recommendationsRoute = 'v1/recommendations'

    const [ tracks, setTracks ] = useState([])
    const [ revealed, setRevealed ] = useState( 10 )

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
        if( menuData.data && menuData.data.length > 0 ){
            getTracks( menuData.data, [] )
        } else {
            getTracks( [...my_liked_tracks, ...my_top_tracks ], my_top_artists )
        }
    },[])

    const getTracks = ( tracks, artists ) => {
        const seeds = getSeeds( available_genre_seeds, artists, tracks )
        finalizeRoute('get', `${ recommendationsRoute }`, null, null, null, ...seeds, 'limit=50')
    }

    const handleAddToPlaylist = ( item ) => {
        alteredPlaylistRef.current = { track: item.name, playlist: menuData.context.name }
        tracksAddedRef.current = [...tracksAddedRef.current, item.id ]
        finalizeRoute('post', `${ addToPlaylistRoute.substr(0, 12) }/${ menuData.context.id }/tracks`, menuData.context.id, null, null, `uris=${ item.uri }`)
    }

    const handleReveal = ( e ) => {
        const scrollHeight = e.target.scrollHeight 
        if( e.target.scrollTop >= scrollHeight * .25  ) {
            const toReveal = tracks.length - revealed 
            setRevealed( toReveal < 10 && toReveal > 0 ? revealed + toReveal : revealed + 10 ) 
        }
    }

    const shrink = useSpring({
        transform: pos >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: pos >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: pos >= selectOverlay.length - 1 ? '85vh' : '100vh'
    })

    return(
        <animated.div style={ shrink } className={ `selectOverlay__menu `} >
            <SelectOverlayHeader menuData={ menuData } />
            <div onScroll={ handleReveal } className='selectOverlay__main'>

                <ul className='selectOverlay__scroll'>
                {
                    tracks.slice( 0, revealed ).map( ( track, i ) => (
                        !tracksAddedRef.current.includes( track.id ) &&
                        <MenuCard 
                        item={ track } 
                        index={ i } 
                        key={ i }
                        page={ menuData.page } 
                        type={ menuData.type } 
                        tracks={ tracks }
                        menuData={ menuData }
                        handleAddToPlaylist= { handleAddToPlaylist }
                        />
                    ))
                }
                </ul>
            </div>
        </animated.div>
    )
}

export default TrackRecommendationsMenu