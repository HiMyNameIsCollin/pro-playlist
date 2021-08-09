import { useContext, useEffect } from 'react'
import { DbFetchedContext, DbHookContext } from '../Dashboard'
import { animated } from 'react-spring'
import MenuCard from './MenuCard'

const ItemMenu = ({ style, handleClose, handlePlaylist, type, items }) => {

    const { user_info } = useContext( DbFetchedContext )
    
    return(
        <animated.div 
        style={ style } 
        className='selectOverlay playlistMenu'>
            <header className='selectOverlay__header '>
                <button onClick={ handleClose }> Cancel </button>
                <p>
                    {
                        type === 'playlists' ? 
                        'Add to playlist' :
                        type === 'albums' ?
                        'Releases' :
                        type === 'recPlayed' &&
                        'Recently played'
                    }
                </p>
            </header>
            <div className='selectOverlay__main playlistMenu__main'>
                <div className='selectOverlay__scroll playlistMenu__scroll'>
                    {
                        type === 'playlists' &&
                        <>
                        <button className='playlistMenu__newBtn'> 
                            New playlist 
                        </button>
                        
                        <form className='selectOverlay__form searchOverlay__form'>
                            <i className="fas fa-search"></i>
                            <input type='text' placeholder='Search playlists'/>
                        </form>
                        </>
                    }
                    {
                        type === 'playlists' ? 
                        items.slice().filter( x => x.collaborative || x.owner.display_name === user_info.display_name).map(( item, i) => (
                            <MenuCard item={ item } index={ i } type={ type } handlePlaylist={ handlePlaylist } />
                        )) 
                        :
                        items.map( (item, i) => <MenuCard item={ item } index={ i } items={ items } type={ type } /> )

                    }
                    
                </div>
            </div>
        </animated.div>
    )
}

export default ItemMenu