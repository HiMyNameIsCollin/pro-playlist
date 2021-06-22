import { useContext } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './Search'

const Card = ({ item, cardType }) => {

    const { setActiveItem, activeSearchItem, setActiveSearchItem } = useContext( DbHookContext )
    const setCurrentSelection = (e) => {
        e.stopPropagation()
        if(cardType === 'browseContainer'){
            setActiveSearchItem( item )
        }else {
            setActiveItem( item )
        }
    }
    

    return(
        <div 
        onClick={ setCurrentSelection } 
        className={`card card--${cardType} ${item.type==='artist' && 'card--artist'}` }>
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
                <h5 className={`card__title ${cardType}__card__title `}>
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
