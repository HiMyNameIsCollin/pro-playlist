import { useState, useEffect, useContext, useRef } from 'react'
import { animated } from 'react-spring'
import ActiveItemTrack from './ActiveItemTrack'
import useApiCall from '../../hooks/useApiCall'
import { whichPicture } from '../../../utils/whichPicture'
import Slider from '../Slider'
import { ManageHookContext } from './Manage'


const ActiveItem = ({ style, data }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )

    const currentActiveItemRef = useRef({})
    const [ items, setItems ] = useState([])
    const [ selectedItems, setSelectedItems ] = useState( [] )

    const { setActiveManageItem } = useContext( ManageHookContext )

    const routes = {
        items: data.type === 'album' ? 
        'v1/albums/tracks' :
        data.type === 'playlist' ?
        'v1/playlists/tracks' :
        'v1/artists/albums'
    }

    useEffect(() => {
        if(apiPayload) setItems( apiPayload.items )
    }, [ apiPayload ])

    useEffect(() => {
        if( data.id ){
            if( currentActiveItemRef.current ){
                if( data.id !== currentActiveItemRef.current.id ){
                    setItems( [] )
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
                setItems( data.items )
            }else {
                let itemsRoute = routes.items.substr( 0, routes.items.length - 6 )
                itemsRoute += data.id
                itemsRoute += data.type === 'artist' ? '/albums' : '/tracks'
                finalizeRoute( 'get', itemsRoute, data.id, null, 'limit=50' )
            }
        }
    },[ data ])



    return(
        <animated.div style={ style } className={`activeItem activeItem--${ data.type }`}>
            
                <div className={`activeItem__imgContainer activeItem__imgContainer--${ data.type }`}>
                    <img src={ whichPicture( data.images, 'med' ) } alt={ `${data.name} image`} />
                </div>
                
                
                <div className={`activeItem__meta activeItem__meta--${ data.type }`}>
                    <h4> { data.name } </h4>
                    
                    {
                        data.type !== 'artist' &&
                        <h5> 
                            { 
                                data.artists ?
                                data.artists[0].name :
                                data.owner.display_name
                            }
                        </h5>
                    }
                    
                    {
                    items.length > 0 &&
                    <p> 
                        { items.length } 
                        {
                            data.type === 'artist' ?
                            items.length > 1 ? 'releases' : 'release'  :
                            items.length > 1 ? 'tracks' : 'track'  
                        }
                    </p>

                    }
                </div>
                

                <div className={`activeItem__itemContainer activeItem__itemContainer--${ data.type }`}>
                {
                    data.type === 'artist' ?
                    <Slider message={ undefined } items={items} setActiveItem={ setActiveManageItem }/>
                    :
                    <div className='activeItem__itemContainer__scroll'>
                    {
                        items.map(( item, i ) => (
                            <ActiveItemTrack 
                            track={ item } 
                            selectedItems={ selectedItems }
                            setSelectedItems={ setSelectedItems }/>
                        ))
                    }
                    </div>
                }


                </div>
        </animated.div>
    )
}

export default ActiveItem