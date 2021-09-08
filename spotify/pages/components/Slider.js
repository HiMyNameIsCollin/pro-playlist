import { useState, useRef } from 'react'
import Card from './Card'
const Slider = ({  message, items, setActiveItem  }) => {

    const [ revealed, setRevealed ] = useState( 10 )

    const thisSliderRef = useRef()

    const handleReveal = ( e ) => {
        const scrollWidth = thisSliderRef.current.scrollWidth 
        if( e.target.scrollLeft >= scrollWidth * .50 ) {
            const toReveal = items.length - revealed 
            setRevealed( toReveal < 10 && toReveal > 0 ? revealed + toReveal : revealed + 10 ) 
        }
    }

    return(
        <section className='slider'>
            {
                message &&
                <p className='slider__title'>
                    { message }
                </p>
            }
            
            <ul ref={ thisSliderRef } onScroll={ handleReveal }className='slider__carousel'>
                {   items.length > 0 &&
                    items.slice( 0, revealed ).map(( item, i ) => (
                        <li key={ i }>
                            <Card 
                            type='slider'
                            item={ item }
                            setActiveItem={ setActiveItem } />
                        </li>
                    )) 
                }
            </ul>
        </section>
    )
}

export default Slider