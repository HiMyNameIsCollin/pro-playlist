import { useContext } from 'react'
import { whichPicture } from "../../utils/whichPicture"
import { capital } from '../../utils/capital'
import { DbHookContext } from './Dashboard'

const Album = ({ item }) => {

    const { setActiveItem } = useContext( DbHookContext )

    return(
        <div className='album' onClick={() => setActiveItem(item)}>
            <div className='album__imgContainer'>
                <img
                height='64px'
                width='64px'
                alt='Album art' 
                src={ whichPicture( item.images, 'sm' )}/>
            </div>
            <h5 className='album__title'> {item.name } </h5>
            <div className='album__meta'>
            
                <span> { capital( item.album_type ) } </span>
                <i className="fas fa-dot-circle"></i>
                <span> {item.release_date.substr(0, 4)} </span>
            </div>
        </div> 
    )
}

export default Album