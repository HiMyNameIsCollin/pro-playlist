import Image from 'next/image'
import { useState, useEffect } from 'react'
import { whichPicture } from '../../utils/whichPicture'



const Card = ({ item, cardType, setActiveItem }) => {

    const setCurrentSelection = () => {
        setActiveItem( item )
    }

    return(
        <div 
        onClick={ setCurrentSelection } 
        className={`card ${cardType}__card` }>
            <div className='card__image'>
                <img 
                src={ item.images ? 
                    whichPicture(item.images, 'med') :
                    item.album.images ?
                    whichPicture(item.album.images, 'med') :
                    item.icons ?
                    item.icons[0].url:
                    null }
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
        </div>
    )
}

export default Card
