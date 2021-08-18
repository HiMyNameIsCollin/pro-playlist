import { useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const SelectOverlayHeader = ({ data  }) => {

    const { selectOverlay, setSelectOverlay } = useContext( DbHookContext )

    const handleClose = () => {
        setSelectOverlay( selectOverlay => selectOverlay = selectOverlay.slice(0, selectOverlay.length - 1) )
    }

    return(
        <header className='selectOverlay__header '>
            <button className='selectOverlay__header__btn' onClick={ handleClose }> Cancel </button>
            <p className='selectOverlay__title'>
            {
                data.type === 'playlists' ? 
                'Add to playlist' :
                data.type === 'albums' ?
                'Releases' :
                data.type === 'recPlayed' ?
                'Recently played' :
                data.type ==='newPlaylist' &&
                'Create a playlist' 
            }
            </p>
        </header>
    )
}

export default SelectOverlayHeader