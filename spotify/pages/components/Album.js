import { useContext } from 'react'
import { whichPicture } from "../../utils/whichPicture"
import { capital } from '../../utils/capital'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'
import Image from 'next/image'
const Album = ({ item }) => {

    const { setActiveHomeItem, setHiddenUI, location } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext )
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    const setActiveItem = setActiveSearchItem ? setActiveSearchItem : setActiveHomeItem


    const handleActiveItem = () => {
        setActiveItem( item )
    }

    return(
        <div className='albumCard' onClick={ handleActiveItem }>
            <div className='albumCard__imgContainer'>
            {
                item.images ?
                <img
                height='64px'
                width='64px'
                alt='Album art' 
                src={ whichPicture( item.images, 'sm' )}/> :
                <Image
                loading='lazy'
                alt='Liked tracks'
                layout='fill'
                objectFit='contain'
                src='/Spotify_Icon_RGB_Green.png'/>
            }
            </div>
            <p className='albumCard__title'> {item.name } </p>
            <div className='albumCard__meta'>
                {
                    item.album_type ?
                    <>
                        <span> { capital( item.album_type ) } </span>
                        <i className="fas fa-dot-circle"></i>
                        <span> {item.release_date.substr(0, 4)} </span>
                    </>
                    :
                    <>
                        <span> by { item.owner.display_name }</span>
                        <i className="fas fa-dot-circle"></i>
                        <span> {`${item.tracks.total} tracks`} </span>
                    </>
                }
                
            </div>
        </div> 
    )
}

export default Album