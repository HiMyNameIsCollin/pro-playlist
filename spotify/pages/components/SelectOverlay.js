
import { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'

const SelectOverlay = ({ selectOverlay, setSelectOverlay}) => {

    const overlayTrans = useTransition( selectOverlay.data,{
        from: { transform: 'translateY(100%)' },
        enter: { transform: 'translateY(0%)' },
        leave: { transform: 'translateY(100%)'}
    })

    return(
       overlayTrans(( props, item ) => (
            item &&
            <animated.div
            style={ overlayTrans } 
            className='selectOverlay__container'>
                <div className='selectOverlay'>
                    <header className='selectOverlay__header'>
                        Select a playlist
                    </header>
                    <div className='selectOverlay__main'>
                        <div className='selectOverlay__scroll'>
                            <h1>test</h1> 

                            <h1>test</h1> 

                            <h1>test</h1> 

                            <h1>test</h1> 

                            <h1>test</h1> 

                            <h1>test</h1> 

                            <h1>test</h1> 

                                <h1>test</h1> 

                                <h1>test</h1> 

                                <h1>test</h1> 

                                <h1>test</h1> 

                                <h1>test</h1> 


                        </div>
                    </div>
                </div>
                
            </animated.div>
       ))
    )
}

export default SelectOverlay 