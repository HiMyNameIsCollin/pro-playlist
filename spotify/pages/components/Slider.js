import Card from './Card'
import { Droppable } from 'react-beautiful-dnd'
const Slider = ({ sortEnabled, message, items, setActiveItem  }) => {
    return(
        <section className='slider'>
            {
                message &&
                <p className='slider__title'>
                    
                    { message }
                    
                </p>
            }
            
            <ul className='slider__carousel'>
                {   items.length > 0 &&
                    items.map(( item, i ) => {
                        if( sortEnabled ){
                            return(
                                <Droppable droppableId={`playlist--${item.id}`}>
                                    {provided => (
                                        <li {...provided.droppableProps} ref={provided.innerRef} >
                                            <Card 
                                            type='homeSlider'
                                            key={ i } 
                                            item={ item }
                                            setActiveItem={ setActiveItem } />
                                        </li>
                                    )}
                                </Droppable> 
                            )
                        } else {
                            return(
                                <li >
                                    <Card 
                                    type='homeSlider'
                                    key={ i } 
                                    item={ item }
                                    setActiveItem={ setActiveItem } />
                                </li>
                            )
                        }
                    }) 
                }
            </ul>
        </section>
    )
}

export default Slider