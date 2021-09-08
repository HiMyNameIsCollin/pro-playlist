import Album from './Album'
import { useContext } from 'react'
import { DbHookContext } from './Dashboard'


const AlbumContainer = ({ page, albums }) => {


    const { setSelectOverlay, setHideAll } = useContext( DbHookContext )

    const handleSeeMore = () => {
        const overlay = { page: page, type: 'albums', data: albums }
        setSelectOverlay( arr => arr = [ ...arr, overlay])
        
    }

    return(
        <section className='albumContainer'>
            <p className='albumContainer__title'>
                Popular releases 
            </p>
            {
            albums.slice(0, 5).map(( item, i ) => <Album key={ i } item={ item } />)
            }
            
            <button onClick={ handleSeeMore } className='albumContainer__btn'> See discography </button>
            
        </section>
    )
}

export default AlbumContainer