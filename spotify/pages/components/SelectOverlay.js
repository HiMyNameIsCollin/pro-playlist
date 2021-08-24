import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { useTransition, animated, useSpring } from 'react-spring'
import useApiCall from '../hooks/useApiCall'
import TrackRecommendationsMenu from './selectOverlay/TrackRecommendationsMenu'
import NewPlaylistForm from './selectOverlay/NewPlaylistForm'
import ItemSelect from './selectOverlay/ItemSelect'
import { DbHookContext, DbFetchedContext } from './Dashboard'

const SelectOverlay = ({ style, newPlaylistRef}) => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setSelectOverlay, setMessageOverlay }  = useContext( DbHookContext )
    const { my_liked_tracks, my_top_tracks, available_genre_seeds, my_top_artists, user_info } = useContext( DbFetchedContext )

    const addToPlaylistRoute = 'v1/playlists/tracks'

    

    const menuTrans = useTransition( selectOverlay.map( item => item ), {
        from: { transform: 'translateY(100%)' },
        enter: item => async (next, cancel) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await next({ transform: 'translateY(0%)' })
          },
        leave: { transform: 'translateY(100%)'}
    })

    return(
        <animated.div style={ style } className='selectOverlay overlay'>
        {
            menuTrans((props, item, t, i) => (
                <animated.div style={ props } className='selectOverlay__menuContainer'>
                {
                    item.type === 'newPlaylist' ?
                    <NewPlaylistForm menuData={ item } pos={ i } newPlaylistRef={ newPlaylistRef } /> :
                    item.type === 'trackRecommendations' ?
                    <TrackRecommendationsMenu  menuData={ item } pos={ i } newPlaylistRef={ newPlaylistRef }/> :
                    (item.type === 'playlists' || item.type === 'albums' || item.type === 'recPlayed') &&
                    <ItemSelect menuData={ item } pos={ i } /> 
                }
                </animated.div>
                
            ))
        }
        </animated.div>
    )
}

export default SelectOverlay