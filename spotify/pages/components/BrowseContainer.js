import { useEffect, useContext } from 'react'
import Card from './Card'
import { DbHookContext } from './Dashboard'

const BrowseContainer = ({ message, data}) => {
    
    const { scrollPosition } = useContext( DbHookContext )

    useEffect(() => {
        if( scrollPosition && scrollPosition === 100 ){
            const fetchMore = () => {
                
            }
            fetchMore()
        }
    },[ scrollPosition ])

    return(
            <section className='browseContainer'> 
                <div className='browseContainer__title'>
                    <h2>
                        { message }
                    </h2>
                    
                </div> 
               {
                   data.map(( item, i ) => {
                    return (
                        <Card
                        key={ i } 
                        item={ item } 
                        cardType='browseContainer'
                        setActive={ setActive } />
                    )
                   })
               }
            </section>
    )
}

export default BrowseContainer