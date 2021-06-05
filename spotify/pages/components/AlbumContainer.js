import { useContext } from 'react'
import { whichPicture } from "../../utils/whichPicture"
import { capital } from '../../utils/capital'
import { DbHookContext } from './Dashboard'

const AlbumContainer = ({ type, albums }) => {

    const { setActiveItem } = useContext( DbHookContext )

    return(
        <section className='albumContainer'>
        <h4>
            { type === 'artist--page' ? 'Popular releases' : 'Discography' }
        </h4>
        {
        type === 'artist--page' &&
            albums.map((album, i) => {
                if(i < 5){
                    return(
                        <div className='album' onClick={() => setActiveItem(album)}>
                            <div className='album__imgContainer'>
                                <img
                                height='64px'
                                width='64px'
                                alt='Album art' 
                                src={ whichPicture( album.images, 'sm' )}/>
                            </div>
                            <div className='album__text'>
                                <h5> {album.name } </h5>
                                <span> { capital( album.album_type ) } </span>
                                <i className="fas fa-dot-circle"></i>
                                <span> {album.release_date.substr(0, 4)} </span>
                            </div>
                        </div> 
                    )

                }
            })

        }
        </section>
    )
}

export default AlbumContainer