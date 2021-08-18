import { useState, useEffect } from 'react'
import { animated } from 'react-spring'
import useApiCall from '../../hooks/useApiCall'
import { whichPicture } from '../../../utils/whichPicture'

import Slider from '../Slider'
import ActiveItem from './ActiveItem'


const PlaylistContainer = ({ style, data, setData }) => {


    const [ tracks, setTracks ] = useState( [] )
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    
    useEffect(() => {
        if( data.id !== 'default') {
            finalizeRoute('get', data.tracks.href.substr( API.length ), data.id, null , null,)
        }
    }, [ data ])

    useEffect(() => {
        if( apiPayload ) setTracks( apiPayload.items )
    },[ apiPayload ])
    return(
        <animated.div
        style={ style } 
        className={ `playlistContainer activeItem activeItem--top ${ !data.type && 'activeItem--artist'} `} >
            
            {
                data.id === 'default' ?
                <Slider message={ 'Your playlists' } items={ data.items } setActivePlaylist={ setData } /> :
                <>
                    <div className={`activeItem__meta activeItem__meta--${ data.type }`}>
                    <h4> { data.name } </h4>
                    </div>
                    <div className={`activeItem__imgContainer activeItem__imgContainer--${ data.type }`}>
                        <img src={ whichPicture( data.images, 'med' ) } alt={ `${data.name} image`} />
                    </div>
                    <div className={`activeItem__itemContainer activeItem__itemContainer--${ data.type }`}>
                        <div className='activeItem__itemContainer__scroll'>
                        {
                            tracks.map( t => <h1> { t.track.name } </h1>)
                        }
                        </div>
                    </div>
                </>
            }
 
        </animated.div>
    )
}

export default PlaylistContainer