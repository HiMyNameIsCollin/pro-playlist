import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { useContext } from 'react'

const Tab = ({ item }) => {

    const { queue, setQueue, setActiveItem } = useContext( DbHookContext )

    const playTrack = ( track, arr, func ) =>{
        // Adds track to Queue. Callback func is 'setQueue'
        if(arr[0] && arr[0].id !== track.id) {
            func( arr => arr = [track, ...arr.slice(1, arr.length-1)] )
        }
    }

    const handleTab = () => {
        if( item.type === 'track'){
            item.album['selectedTrack'] = item.id
            setActiveItem( item.album )
        } else {
            setActiveItem( item )
        }
    }

    return(
        <div onClick={ handleTab } className='tab'>
            <div className='tab__image'>
                <img src={ item.images ? whichPicture(item.images, 'sm') : whichPicture(item.album.images, 'sm')} alt=""/>
            </div>
            <h5 className='tab__title'>
                { item.name }
            </h5>
        </div>
    )
}

export default Tab