import { useEffect, useContext } from 'react'
import Card from './Card'
import { DbHookContext } from './Dashboard'

const BrowseContainer = ({ type, message, data, }) => {
    
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
                    <h3>
                        { message }
                    </h3>
                    
                </div> 
               {
                   data.map(( item, i ) => {
                    return (
                        <Card
                        key={ i } 
                        item={ item } 
                        cardType='browseContainer'
                        />
                    )
                   })
               }
            </section>
    )
}

export default BrowseContainer