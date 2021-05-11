import { useEffect, useState } from 'react'
import Card from './Card'

const BrowseContainer = ({ type, data, scrollPosition, getCategories }) => {
    
    useEffect(() => {
        if( scrollPosition && scrollPosition === 100 ){
            const fetchMore = () => {
                getCategories( `offset=${data.length}`)
            }
            fetchMore()
        }
    },[ scrollPosition ])

    return(
            <section className='browseContainer'> 
                <div className='browseContainer__title'>
                    <h2>
                        { type }
                    </h2>
                    
                </div> 
               {
                   data.map(( item, i ) => {
                    return (
                        <Card
                        key={ i } 
                        item={ item } 
                        cardType='browseContainer' />
                    )
                   })
               }
            </section>
    )
}

export default BrowseContainer