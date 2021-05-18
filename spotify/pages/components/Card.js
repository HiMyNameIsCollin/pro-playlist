import Image from 'next/image'
import { useState, useEffect } from 'react'
import { whichPicture } from '../../utils/whichPicture'



const Card = ({ item, cardType, dispatch }) => {

    const setCurrentSelection = () => {
        let payload = { ...item }
        payload['route'] = 'current_selection'
        dispatch( payload )
    }

    return(
        <div 
        onClick={ setCurrentSelection } 
        className={`card ${cardType}__card` }>
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
        </div>
    )
}

export default Card
