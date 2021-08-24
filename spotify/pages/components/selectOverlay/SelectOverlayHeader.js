import { useContext } from 'react'
import useApiCall from '../../hooks/useApiCall'
import { DbHookContext } from '../Dashboard'

const SelectOverlayHeader = ({ menuData  }) => {

    const { selectOverlay, setSelectOverlay } = useContext( DbHookContext )

    const handleClose = () => {
        setSelectOverlay( selectOverlay => selectOverlay = selectOverlay.slice(0, selectOverlay.length - 1) )
    }

    return(
        <header className='selectOverlay__header '>
            <button className='selectOverlay__header__btn' onClick={ handleClose }> Cancel </button>
            <p className='selectOverlay__title'>
            {
                menuData.type === 'playlists' ? 
                'Add to playlist' :
                menuData.type === 'albums' ?
                'Releases' :
                menuData.type === 'recPlayed' ?
                'Recently played' :
                menuData.type ==='newPlaylist' ?
                'Create a playlist' :
                menuData.type === 'trackRecommendations' &&
                'Add tracks'
            }
            </p>
        </header>
    )
}

export default SelectOverlayHeader