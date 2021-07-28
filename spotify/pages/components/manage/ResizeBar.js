import { useState, useEffect, useLayoutEffect, useRef } from 'react'

const ResizeBar = ({ sortContainerRef, resizePos, setResizePos }) => {

    const [ active, setActive ] = useState( false )

    const resizeBarRef = useRef()
        // useEffect(() => {
        //     const pb = window.getComputedStyle(sortContainerRef, null).getPropertyValue('padding-bottom')
        //     const paddingBottom = Math.round( pb.substring( 0,  pb.length - 2 ) )
        //     const height = sortContainerRef.current.getBoundingClientRect().height
        //     const half = ( (height - paddingBottom) - 8 )/ 2 
        //     const percent = ( half / height ) * 100
        //     setResizePos( percent )
        // },[])

    useEffect(() => {
        if( active ) {
            window.addEventListener( 'pointermove', handleDrag )
            window.addEventListener( 'pointerup', stopDrag )
            window.addEventListener( 'touchmove', handleDrag )
            window.addEventListener( 'touchup', stopDrag )
        } else {
            removeListeners()
        }
        return () => {
            removeListeners()
            setResizePos( undefined )
        }
    }, [ active ])

    const removeListeners = () => {
        window.removeEventListener('pointermove', handleDrag)
        window.removeEventListener( 'pointerup', stopDrag )
        window.removeEventListener( 'touchmove', handleDrag )
        window.removeEventListener( 'touchup', stopDrag )
    }

    const handleDrag = (e) =>{
        e.stopPropagation()
        const parent = sortContainerRef
        const parentHeight = parent.getBoundingClientRect().height
        const barHeight = resizeBarRef.current.offsetHeight
        let pos = 0
        if( e.type === 'touchmove'){
            pos = e.touches[0].clientY
        } else {
            pos = e.clientY
        }
        let percent = 0
        if( pos >= parentHeight ){
            percent = 100 - ( ( barHeight / parentHeight ) * 100 )
            
        } else if ( pos <= 0 ){
            percent = 0
        } else {
            percent = ( pos / parentHeight ) * 100
        }
        setResizePos( percent  )
    }

    const stopDrag = (e) => {
        setActive(false)
    }



    return(
        <div 
            ref={ resizeBarRef }
            // onMouseUp={ handleCloseSortContainer } 
            onPointerDown={ () => setActive( true )}
            onClick={ () => setActive( true )}
            onTouchStart={ () => setActive( true )}
            style={ resizePos !== undefined ? { top: resizePos + '%' } : {}}
            className='sortContainer__resize'>

        </div>
    )
}

export default ResizeBar