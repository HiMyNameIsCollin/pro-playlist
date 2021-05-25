import Slider from '../Slider'
const Recommendations = ({ data , setActiveItem }) => {
    return(
        <section className='recommendations'>
            <Slider 
            message={'You may also enjoy: '} 
            items={ data }
            setActiveItem={ setActiveItem } />
        </section>
    )
}

export default Recommendations