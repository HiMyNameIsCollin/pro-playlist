import { useEffect, useContext, useState } from 'react'
import Card from './Card'
import { DbHookContext } from './Dashboard'

const BrowseContainer = ({ type, message, data, }) => {

    const [ thisData, setThisData ] = useState( [] )
    
    const { scrollPosition } = useContext( DbHookContext )

    // useEffect(() => {
    //     if( scrollPosition && scrollPosition === 100 ){
    //         const fetchMore = () => {
                
    //         }
    //         fetchMore()
    //     }
    // },[ scrollPosition ])

    useEffect(() => {
        if( data.length > 0 ) setThisData( data )

    },[ data ])

    return(
            <section className='browseContainer'> 
                <p className='browseContainer__title'>
                    { message }

                </p> 
               {
                   thisData.map(( item, i ) => {
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