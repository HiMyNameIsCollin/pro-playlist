import { useState, useEffect, useContext, useRef } from 'react'
import { animated } from 'react-spring'
import ActiveItemTrack from './ActiveItemTrack'
import useApiCall from '../../hooks/useApiCall'
import { whichPicture } from '../../../utils/whichPicture'


const ActiveItem = ({ style, data }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )

    const currentActiveItemRef = useRef({})
    const [ items, setTracks ] = useState([])
    const [ selectedItems, setSelectedItems ] = useState( [] )

    const routes = {
        items: data.type === 'album' ? 
        'v1/albums/tracks' :
        data.type === 'playlist' ?
        'v1/playlists/tracks' :
        'v1/artist/albums'
    }

    useEffect(() => {
        if(apiPayload) setTracks( apiPayload.items )
    }, [ apiPayload ])

    useEffect(() => {
        if( data.id ){
            if( currentActiveItemRef.current ){
                if( data.id !== currentActiveItemRef.current.id ){
                    setTracks( [] )
                }
            } else {
                currentActiveItemRef.current = data
            }        
        } else {
            currentActiveItemRef.current = {}
        }
    }, [ data ])

    useEffect(() => {
        if(data.type){
            if( Array.isArray( data.items ) ){
                setTracks( data.items )
            }else {
                let itemsRoute = routes.items.substr( 0, routes.items.length - 6 )
                itemsRoute += data.id
                itemsRoute += '/tracks'
                finalizeRoute( 'get', itemsRoute, data.id, null )
            }
        }
    },[ data ])
    return(
        <animated.div style={ style } className='activeItem'>
            <div className='activeItem__header'>
                <h2> { data.name } </h2>
                {
                items.length > 0 &&
                <span> { items.length } {items.length > 1 ? 'songs' : 'song' } </span>

                }
            </div>
                <div className='activeItem__imgContainer'>
                    <img src={ whichPicture( data.images, 'med' ) } alt={ `${data.name} image`} />
                </div>
                <div className='activeItem__itemContainer'>
                    <div className='activeItem__itemContainer__scroll'>
                    {
                        items.map(( item, i ) => (
                            <ActiveItemTrack 
                            track={ item } 
                            selectedItems={ selectedItems }
                            setSelectedItems={ setSelectedItems } />
                        ))
                    }
                    </div>


                </div>
        </animated.div>
    )
}

export default ActiveItem