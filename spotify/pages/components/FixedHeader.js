import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const FixedHeader = ({ activeHeader, headerScrolled }) => {
    const [ hidden, setHidden ] = useState(true)

    useEffect(() => {
        if( headerScrolled > 50 ){
            setHidden(false)
        } else{
            setHidden( true )
        }
    },[headerScrolled])

    const showFixedHeader = useSpring({
        transform: hidden ? 'translateY(-100%)' : 'translateY(0%)',
        opacity: hidden ? 0 : 1
    })

    const {scaleUp, fadeIn, textScroll} = useSpring({
        scaleUp: `${ 1.00 + ( headerScrolled * 0.01 ) }`,
        fadeIn: `${ 0 + ( headerScrolled * 0.01 )}`,
        textScroll: `${ 200 - ( headerScrolled * 2 )}`,
    })
    return(
        <animated.div

        style={ showFixedHeader } 
        className='fixedHeader'>
            <button className='backButton'>
                <i className="fas fa-chevron-left"></i>
            </button>
            <animated.h3 style={{
                opacity: fadeIn.to( o => o),
                transform: textScroll.to( y => `translateY(${ y }%)`)
            }}> { activeHeader.data && activeHeader.data } </animated.h3>
        </animated.div>
    )
}

export default FixedHeader