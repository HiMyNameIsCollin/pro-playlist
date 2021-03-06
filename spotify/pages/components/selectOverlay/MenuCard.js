import { useContext, useState, useEffect, useRef } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { DbHookContext } from '../Dashboard'
import Image from 'next/image'
const MenuCard = ({ item , type, page, index, allData, soFunctions , menuData, handleAddToPlaylist }) => {

    const { setActiveHomeItem, setActiveManageItem, setActiveSearchItem, selectOverlay, setSelectOverlay, queue, qIndex, setQueue, setQIndex } = useContext( DbHookContext )
    
    const [ active, setActive ] = useState(false)
    const addedRef = useRef( false )

    useEffect(() => {
        if( type === 'recPlayed' || type ==='trackRecommendations'){
            if( queue[qIndex].id === item.id ){
                setActive( true )
            } else {
                if( active ) setActive( false )
            }
        }
    },[ qIndex ])


    const setActiveItem = (param) => {
        if(page === 'home'){
            setActiveHomeItem( param )
        } else if( page === 'search'){
            setActiveSearchItem( param )
        } else if ( page === 'manage'){
            setActiveManageItem( param )
        }
    }

    const menuAction = ( param ) => {
        if( type === 'playlists' ){
            handleAddToPlaylist( param )
        } else if( type === 'albums') {
            setActiveItem( param )
        } else if( type === 'recPlayed'){
            handlePlayTrack( index )
        } else if ( type === 'trackRecommendations' ){
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
        if( type === 'recPlayed' || type ==='trackRecommendations'){
            menuAction( param )
        }else {
            setTimeout(() => menuAction(param), 250)
            setSelectOverlay( arr => arr = [ ...arr.slice(1) ])
        }
    }

    const handlePlaylist = ( e ) => {
        e.stopPropagation()
        if( !addedRef.current ) {
            addedRef.current = true 
            handleAddToPlaylist( item )

        }
    }

    return(
        <li 
        className={ `albumCard`} onClick={ () => handleSelectItem( item ) }>
            <div className='albumCard__imgContainer'>
            {
                item.images && item.images.length > 0 || item.album && item.album.images.length > 0 ?
                <img
                alt='Album art' 
                loading='lazy'
                src={ whichPicture( item.images ? item.images : item.album.images , window.innerWidth >= 768 ? 'med' : 'sm' )}/>
                :
                <Image
                loading='lazy'
                alt='Liked tracks'
                layout='fill'
                objectFit='contain'
                src='/Spotify_Icon_RGB_Green.png'/>
            }
                
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
                        if( i < item.artists.length - 1) return <span key={ i }> {`${ artist.name }, `} </span> 
                        return <span key={ i }> {artist.name} </span> 

                    })
                }

            </div>
            {
                type === 'trackRecommendations' &&
                <button onClick={ handlePlaylist }>
                    <i className="fas fa-plus"></i>
                </button>
            }
            
        </li> 
    )
}

export default MenuCard 