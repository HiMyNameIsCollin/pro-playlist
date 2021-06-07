import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

const FixedHeader = () => {


    
    return(
        <animated.div
        style={ showFixedHeader } 
        className='fixedHeader'>
            
            <animated.h1 style={{
                opacity: fadeIn.to( o => o),
                transform: textScroll.to( y => `translateY(${ y }%)`)
            }}> { data.name } </animated.h1>
        </animated.div>
    )
}

export default FixedHeader