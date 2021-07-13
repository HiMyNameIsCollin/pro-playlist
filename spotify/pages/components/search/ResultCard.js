import { useEffect, useContext } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { handleColorThief } from '../../../utils/handleColorThief'
import { DbHookContext } from '../Dashboard'
import { SearchHookContext } from './Search'

const ResultCard = ({ data }) => {

    const { setOverlay, setQueue, setQIndex} = useContext( DbHookContext )
    const { setActiveSearchItem } = useContext( SearchHookContext)

    
    const handleTrackMenu = (e, selectedTrack ) => {
        e.stopPropagation()
        if(!selectedTrack.images){
            selectedTrack.images = selectedTrack.album.images
        }
        const popupData = {
            selectedTrack,
        }
        setOverlay( {type: 'trackMenu', pageType: 'result', data: popupData,  func: setActiveSearchItem} )
    }

    const playTrack = () => {
        setQueue( [ data ] )
        setQIndex( 0 )
    }
    

    const handleSearchSelection = () => {
        if( data.type === 'track'){
            playTrack()
        }else {
            setActiveSearchItem( data )
        }
    }
    

    return(
        <div className={`resultCard ${data.type==='artist' && 'resultCard--artist'}`} 
            onClick={ handleSearchSelection }>
            <div className='resultCard__imgContainer'>
                {
                data.images &&
                <img src={ whichPicture( data.images, 'sm') } />
                }
                {
                data.album && data.album.images &&
                <img src={ whichPicture( data.album.images, 'sm') } />
                }
                
            </div>
            <h5 className='resultCard__name'>
                { data.name }
            </h5>   
            <span className='resultCard__type'> { data.type.charAt(0).toUpperCase() + data.type.slice(1) } </span>
            {
            data.type !== 'track' ?
            <i class="fas fa-chevron-right"></i> 
            :
            <i className="fas fa-ellipsis-h track__menuBtn"
                onClick={ (e) => handleTrackMenu(e, data ) }></i> 
            }
                   
        </div>
    )
}

export default ResultCard 