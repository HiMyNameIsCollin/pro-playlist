import Card from './Card'

const Slider = ({ message, items, setActive }) => {
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
                    cardType='slider'
                    key={ i } 
                    item={ item }
                    setActive={ setActive } />)) :
                    <div className='slider__loading'>
                        Loading
                    </div>
                }
            </div>
        </section>
    )
}

export default Slider