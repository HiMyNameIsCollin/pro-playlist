import { whichPicture } from '../../utils/whichPicture'
import { useContext } from 'react'
import { DbHookContext } from './Dashboard'

const Tab = ({ item }) => {

    const { setActiveHomeItem } = useContext( DbHookContext )

    const handleTab = () => {
        if( item.type === 'track'){
            // Set selectedTrack param on track. Therefore activeItem will push us to the respective page,
            // but will not play the track immediately. Instead it will scroll to position.
            item.album['selectedTrack'] = item.id
            setActiveHomeItem( item.album )
        } else {
            setActiveHomeItem( item )
        }
    }

    return(
        <div onClick={ handleTab } className='tab'>
            <div className='tab__image'>
                <img src={ item.images ? whichPicture(item.images, 'sm') : whichPicture(item.album.images, 'sm')} alt=""/>
            </div>
            <p className='tab__title'>
                { item.name }
            </p>
        </div>
    )
}

export default Tab