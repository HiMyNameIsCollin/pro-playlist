import Image from 'next/image'
import { useState, useEffect } from 'react'
import { whichPicture } from '../../utils/whichPicture'



const Card = ({ item, cardType, Link }) => {

    return(
        <div className={`card ${cardType}__card` }>
            <Link to={
                item.type === 'artist' ?
                `/artist/${item.id}` :
                item.type === 'album' || 
                item.type === 'playlist' ?
                `/album/${item.id}` :
                `/showcase/${item.id}`
                
            }>
            <div className='card__image'>
                <img 
                src={ item.images ? 
                    whichPicture(item.images, 'med') :  
                    item.icons[0].url }
                    alt='Track art'/>
            </div>
            {
                item.name &&
                <h5 className={`card__title ${cardType}__card__title `}>
                  { item.name }               
                </h5>
            }
            {
                item.tracks && 
                <p className='card__meta'>
                    { item.tracks.total }songs
                </p>
            }
            </Link>
        </div>
    )
}

export default Card
