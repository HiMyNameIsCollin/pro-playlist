import { useSpring, animated } from "react-spring"

const HeaderBacking = ({ headerAni, fullHeader, collection, headerMounted }) => {

    const showFixedHeader = useSpring({
        transform: fullHeader ? 'translateY(-100%)' : 'translateY(0%)',
        opacity: fullHeader ? 0 : 1
    })

    return(
        <>
            <div className={ `headerBacking ${ headerMounted && 'headerBacking--active' }`} >
            </div>
            <animated.div
            style={ showFixedHeader } 
            className='fixedHeader'>
                <animated.h1 style={{
                    opacity: headerAni.fadeIn.to( o => o),
                    transform: headerAni.textScroll.to( y => `translateY(${ y }%)`)
                }}> { collection.name } </animated.h1>
            </animated.div>
        </>
    )
}

export default HeaderBacking