import Card from './Card'
const BrowseContainer = ({ data, type }) => {
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