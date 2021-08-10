import Card from './Card'

const Slider = ({ message, items, setActiveItem  }) => {
    return(
        <section className='slider'>
            {
                message &&
                <p className='slider__title'>
                    
                    { message }
                    
                </p>
            }
            
            <div className='slider__carousel'>
                {   items.length > 0 &&
                    items.map(( item, i ) => (

                        <Card 
                        type='homeSlider'
                        key={ i } 
                        item={ item }
                        setActiveItem={ setActiveItem } />
                    
                    )) 
                }
            </div>
        </section>
    )
}

export default Slider