import Album from './Album'
import { useContext } from 'react'


const AlbumContainer = ({ type, albums }) => {

    return(
        <section className='albumContainer'>
        <h4>
            { type === 'artist--page' ? 'Popular releases' : 'Discography' }
        </h4>
        {
        type === 'artist--page' &&
        albums.map((album, i) => i < 5 && <Album item={ album } />)
        }
        {
            type === 'artist--page' &&
            <button className='albumContainer__btn'> See discography </button>
        }
        </section>
    )
}

export default AlbumContainer