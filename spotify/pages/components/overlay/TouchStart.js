
const TouchStart = ({ setOverlay }) => {


    return(
        <section onTouchEnd={ () => setOverlay(null)} className='touchStart'>

        </section>
    )
}

export default TouchStart