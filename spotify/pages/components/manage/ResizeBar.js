import { useState, useEffect, useCallback } from 'react'

const ResizeBar = ({ parentHeight, resizePos, setResizePos }) => {

    const [ active, setActive ] = useState( false )
    const [ height, setHeight ] = useState()

    const resizeBarRef = useCallback(node => {
        if (node !== null) {
            setHeight( node.getBoundingClientRect().height )
        }
      }, []);

    useEffect(() => {
        const maxHeight = parentHeight - height
        setResizePos( maxHeight / 2 )
    },[ height ])

    useEffect(() => {
        if( active ) {
            window.addEventListener( 'pointermove', handleDrag )
            window.addEventListener( 'pointerup', stopDrag )
            window.addEventListener( 'touchmove', handleDrag )
            window.addEventListener( 'touchend', stopDrag )
            window.addEventListener( 'touchcancel', stopDrag )

        } else {
            removeListeners()
        }
        return () => {
            removeListeners()
            
        }
    }, [ active ])

    const removeListeners = () => {
        window.removeEventListener('pointermove', handleDrag)
        window.removeEventListener( 'pointerup', stopDrag )
        window.removeEventListener( 'touchmove', handleDrag )
        window.removeEventListener( 'touchend', stopDrag )
        window.addEventListener( 'touchcancel', stopDrag )
    }

    const handleDrag = (e) =>{
        e.stopPropagation()
        const maxHeight = parentHeight - height
        let pos = 0
        if( e.type === 'touchmove'){
            pos = e.touches[0].clientY
        } else {
            pos = e.clientY
        }
        if( pos >= maxHeight - (height / 2) ){
            pos = maxHeight - (height / 2) + ( height / 3)
        } else if ( pos <= height ){
            pos = height
        } 
        setResizePos( pos )
    }

    const stopDrag = (e) => {
        setActive(false)
    }



    return(
        <div 
            ref={ resizeBarRef }
            // onMouseUp={ handleCloseSortContainer } 
            onPointerDown={ () => setActive( true )}
            onTouchStart={ () => setActive( true )}
            style={{ top: resizePos - ( height / 2 )}}
            className={` sortContainer__resize ${ active && 'sortContainer__resize--active'}`}>

        </div>
    )
}

export default ResizeBar