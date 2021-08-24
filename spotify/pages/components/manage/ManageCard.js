import { whichPicture } from '../../../utils/whichPicture'
import { useState, useEffect, useContext } from 'react'
import { ManageHookContext } from './Manage'
import Image from 'next/image'

const ManageCard = ({ item, listType }) => {

    const [ image, setImage ] = useState()
    const { setActiveManageItem } = useContext( ManageHookContext )


    useEffect(() => {
        let img
        if( listType === 'bar' ) {
            img = whichPicture( item.images, 'sm' )
        } else {
            img = whichPicture( item.images, 'med' )
        }
        setImage( img )
    }, [ listType, item ])

    return(
        <div onClick={ () => setActiveManageItem( item ) } className={ `mngCard mngCard--${listType} mngCard--${item.type}` }>
            <div className={ `mngCard__imgContainer mngCard__imgContainer--${listType} mngCard__imgContainer--${item.type} `}>
                {
                    image ?
                    <img
                    loading='lazy'
                    alt='Collection Cover' 
                    src={ image } /> :
                    <Image
                    loading='lazy'
                    alt='Liked tracks'
                    layout='fill'
                    objectFit='contain'
                    src='/Spotify_Icon_RGB_Green.png'/>
                }
                
            </div>
            
            <div className={ `mngCard__meta mngCard__meta--${listType}`}>
                <p className='mngCard__title'> { item.name } </p>
                {
                item.type !== 'artist' &&
                    <>
                        <p className='mngCard__info'> 
                            { item.type.charAt(0).toUpperCase() + item.type.substr( 1 )  } 
                            <i className="fas fa-dot-circle"></i>
                        {
                            item.name === 'Liked Tracks' ||
                            item.name === 'To be added' ?
                            `${ item.items.length } ${item.items.length > 1 ? 'songs' : 'song'}` :
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