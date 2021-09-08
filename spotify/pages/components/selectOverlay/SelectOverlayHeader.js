import { useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const SelectOverlayHeader = ({ menuData  }) => {

    const { selectOverlay, setSelectOverlay, refresh } = useContext( DbHookContext )

    const handleClose = () => {
        refresh( 'my_playlists' )
        setSelectOverlay( selectOverlay => selectOverlay = selectOverlay.slice(0, selectOverlay.length - 1) )
    }

    return(
        <header className='selectOverlay__header '>
            <button className='selectOverlay__header__btn' onClick={ handleClose }> Back </button>
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