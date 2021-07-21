import { whichPicture } from '../../../utils/whichPicture'
import { useState, useEffect } from 'react'


const ManageCard = ({ item, listType }) => {

    const [ image, setImage ] = useState()

    useEffect(() => {
        let img
        if( listType === 'bar' ) {
            img = whichPicture( item.images, 'sm' )
        } else {
            img = whichPicture( item.images, 'med' )
        }
        setImage( img )
    }, [ listType ])

    return(
        <div className={ `mngCard mngCard--${listType}` }>
            <div className={ `mngCard__imgContainer mngCard__imgContainer--${listType} ${ item.type } `}>
                <img
                alt='Liked tracks playlist cover' 
                src={ image } />
            </div>
            
            <div className={ `mngCard__info mngCard__info--${listType}`}>
                <h5> { item.name } </h5>
                {
                item.type !== 'artist' &&
                    <>
                        <p> 
                            { item.type  } 
                        {
                            item.name === 'Liked Tracks' ?
                            `${ item.tracks.length } songs` :
                            item.type === 'playlist' ?
                            item.owner.display_name :
                            item.type === 'album' &&
                            item.artists[0].name 
                        }
                        </p>
                    </>
                }
                
                
            </div>
        </div>

    )
}

export default ManageCard