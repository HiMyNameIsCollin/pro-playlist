import { useEffect, useState, useRef, useContext } from 'react'

const useOnScreen = ({root = null, rootMargin, threshold = 0  }) => {
    
    const [node, setNode] = useState( null )
    const [isOnScreen, setIsOnScreen] = useState( false )
    const observerRef = useRef( null )


    useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
        setIsOnScreen(entry.isIntersecting),
    )
    }, [])

    useEffect(() => {
    if ( node ){
        if( observerRef.current ) observerRef.current.disconnect()
        observerRef.current.observe(node)
        return () => {
            observerRef.current.disconnect()
        }
    }

    }, [ node ])

    return [ isOnScreen, setNode ]
}

export default useOnScreen