import Card from './Card'

const Slider = ({ message, items,  }) => {
    return(
        <section className='slider'>
            {
                message &&
                <div className='slider__title'>
                    <h4>
                    { message }
                    </h4>
                </div>
            }
            
            <div className='slider__carousel'>
                {   items.length > 0 ?
                    items.map(( item, i ) => (
                    <Card 
                    type='HomeSlider'
                    key={ i } 
                    item={ item } />)) :
                    <div className='slider__loading'>
                        Loading
                    </div>
                }
            </div>
        </section>
    )
}

export default Slider