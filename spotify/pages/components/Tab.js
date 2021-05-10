import { whichPicture } from '../../utils/whichPicture'

const Tab = ({ item }) => {
    return(
        <div className='tab'>
            <div className='tab__image'>
                <img src={ whichPicture(item.track.album.images, 'sm') } alt=""/>
            </div>
            <h5 className='tab__title'>
                { item.track.name }
            </h5>
        </div>
    )
}

export default Tab