import { useContext } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './search/Search'
import { ManageHookContext } from './manage/Manage'

const Card = ({ type, item, setActivePlaylist }) => {

    const { activeHomeItem, setActiveHomeItem, setHiddenUI, searchPageHistoryRef, homePageHistoryRef } = useContext( DbHookContext )
    const manageContext = useContext( ManageHookContext)
    const searchContext = useContext( SearchHookContext )
    const pageHistoryRef = searchContext ? searchPageHistoryRef : homePageHistoryRef
    const activeSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    const setActiveSearchItem = searchContext ? searchContext.setActiveSearchItem : null
    const activeManageItem = manageContext ? manageContext.activeManageItem : null
    const setActiveManageItem = manageContext ? manageContext.setActiveManageItem : null
    const activeItem = searchContext? activeSearchItem : activeHomeItem
    const setActiveItem = setActivePlaylist ?
                            setActivePlaylist :  
                            manageContext ? 
                            setActiveManageItem :
                            searchContext ? 
                            setActiveSearchItem : 
                            setActiveHomeItem
                        


    const setCurrentSelection = (e) => {
        e.stopPropagation()
        setActiveItem( item )
        
    }
    

    return(
        <div 
        onClick={ setCurrentSelection } 
        className={`card card--${type} card--${item.type}` }>
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
