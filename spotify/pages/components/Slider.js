import Card from './Card'

const Slider = ({ message, items, setActiveItem }) => {
    return(
        <section className='slider'>
            <div className='slider__title'>
                <h2>
                { message }
                </h2>
            </div>
            <div className='slider__carousel'>
                {   items.length > 0 ?
                    items.map(( item, i ) => (
                    <Card 
                    type='HomeSlider'
                    key={ i } 
                    item={ item }
                    setActiveItem={ setActiveItem } />)) :
                    <div className='slider__loading'>
                        Loading
                    </div>
                }
            </div>
        </section>
    )
}

export default Slider