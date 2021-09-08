import { useEffect, useContext } from 'react'
import Card from './Card'
import { DbHookContext } from './Dashboard'

const BrowseContainer = ({ type, message, data, }) => {
    
    const { scrollPosition } = useContext( DbHookContext )

    // useEffect(() => {
    //     if( scrollPosition && scrollPosition === 100 ){
    //         const fetchMore = () => {
                
    //         }
    //         fetchMore()
    //     }
    // },[ scrollPosition ])

    return(
            <section className='browseContainer'> 
                <p className='browseContainer__title'>
                    { message }

                </p> 
               {
                   data.map(( item, i ) => {
                    return (
                        <Card
                        key={ i } 
                        item={ item } 
                        type={ 'bc' }
                        />
                    )
                   })
               }
            </section>
    )
}

export default BrowseContainer