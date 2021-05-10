import Card from './Card'

const Slider = ({ type, items }) => {
    return(
        <section className='slider'>
            <div className='slider__title'>
                <h2>
                   My { type }
                </h2>
            </div>
            <div className='slider__carousel'>
                {   items.length > 0 ?
                    items.map(( item, i ) => (
                    <Card 
                    cardType='slider'
                    key={ i } 
                    item={ type ==='albums' ? item.album : item }/>)) :
                    <div className='slider__loading'>
                        Loading
                    </div>
                }
            </div>
        </section>
    )
}

export default Slider