import { useContext } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './Search'

const Card = ({ type, item }) => {

    const { setActiveHomeItem, setHiddenUI } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext )
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    const setActiveItem = setActiveSearchItem ? setActiveSearchItem : setActiveHomeItem


    const setCurrentSelection = (e) => {
        e.stopPropagation()
        setActiveItem( item ) 
    }
    

    return(
        <div 
        onClick={ setCurrentSelection } 
        className={`card card--${type} ${item.type==='artist' && 'card--artist'}` }>
            <div className='card__imgContainer'>
                <img 
                loading='lazy'
                src={ 
                    item.images ? 
                    whichPicture(item.images, 'med') :
                    item.album && item.album.images ?
                    whichPicture(item.album.images, 'med') :
                    item.icons ?
                    item.icons[0].url:
                    null 
                }
                    alt='Track art'/>
            </div>
            {
                item.name &&
                <h5 className={`card__title `}>
                  { item.name }               
                </h5>
            }
            {
                item.tracks && 
                <p className='card__meta'>
                    { item.tracks.total }songs
                </p>
            }
        </div>
    )
}

export default Card
