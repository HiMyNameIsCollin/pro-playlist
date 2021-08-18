import { useContext, useState, useEffect } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { DbHookContext } from '../Dashboard'
const MenuCard = ({ item, allData, type, index, handlePlaylist }) => {

    const { setActiveHomeItem, setActiveManageItem, setActiveSearchItem, selectOverlay, setSelectOverlay, queue, qIndex, setQueue, setQIndex } = useContext( DbHookContext )
    const [ active, setActive ] = useState(false)

    useEffect(() => {
        if( type === 'recPlayed'){
            if( queue[qIndex].id === item.id ){
                setActive( true )
            } else {
                if( active ) setActive( false )
            }
        }
    },[ qIndex ])


    const setActiveItem = (param) => {
        if(item.page === 'home'){
            setActiveHomeItem( param )
        } else if( item.page === 'search'){
            setActiveSearchItem( param )
        } else if ( item.page === 'manage'){
            setActiveManageItem( param )
        }
    }

    const menuAction = ( param ) => {
        if( type === 'playlists'){
            handlePlaylist( param )
        } else if( type === 'albums') {
            setActiveItem( param )
        } else if( type === 'recPlayed'){
            handlePlayTrack( index )
        }
    }

    const handlePlayTrack = ( index ) => {
        if( queue[ index ].id === item.id ){
            setQIndex( index )
        }else { 
            setQueue( allData )
            setQIndex( index )
        }
    }


    const handleSelectItem = ( param ) => {
        if( type === 'recPlayed'){
            menuAction( param )
        }else {
            setTimeout(() => menuAction(param), 250)
            setSelectOverlay( arr => arr = [ ...arr.slice(1) ])
        }

    }

    return(
        <div 
        className={ `albumCard`} onClick={ () => handleSelectItem( item ) }>
            <div className='albumCard__imgContainer'>
                <img
                height='64px'
                width='64px'
                alt='Album art' 
                loading='lazy'
                src={ whichPicture( item.images ? item.images : item.album.images , 'sm' )}/>
            </div>
            <p className={`albumCard__title albumCard__title--${ active && 'active'}` }> {item.name } </p>
            <div className='albumCard__meta'>
                {
                    type === 'playlists' &&
                    <>
                        <span> by { item.owner.display_name }</span>
                        <i className="fas fa-dot-circle"></i>
                        <span> {`${item.tracks.total} tracks`} </span>
                    </>
                }
                {
                    type !== 'playlists' &&
                    item.artists.map(( artist, i)  => {
                        if( i < item.artists.length - 1) return <span> {`${ artist.name }, `} </span> 
                        return <span> {artist.name} </span> 

                    })
                }

            </div>
        </div> 
    )
}

export default MenuCard 