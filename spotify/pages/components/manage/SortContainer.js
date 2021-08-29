import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { animated, useTransition, useSpring } from 'react-spring'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { DbFetchedContext, DbHookContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'
import ResizeBar from './ResizeBar'

const SortContainer = ({ style, setActiveItem,  }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { sortBar, setSortBar } = useContext( DbHookContext )
    const { my_playlists, user_info } = useContext( DbFetchedContext )
    const { activeManageItem, setActiveManageItem,} = useContext( ManageHookContext )
    const [ activePlaylistItem, setActivePlaylistItem ] = useState({})

    const [ bottomItems, setBottomItems ] = useState( [] )
    const [ topItems , setTopItems ] = useState( [] )

    const [ dragging, setDragging ] = useState( false )
    const [ height, setHeight ] = useState()
    const [ resizePos, setResizePos ] = useState(0)
    const [ clickLoc, setClickLoc ] = useState( 0 )
    const originalBottomItemsRef = useRef()
    const originalTopItemsRef = useRef()


    const sortContainerRef = useCallback(node => {
        if (node !== null) {
            setHeight( node.getBoundingClientRect().height )
        }
      }, []);

      useEffect(() => {
          setSortBar( true )
          return () => setSortBar( false )
      },[])

    useEffect(() => {
        if(activeManageItem.type){
            //  Default setting for the playlist menu. Renders slider that to display all playlists.
            if( !activePlaylistItem.type) setActivePlaylistItem({ type:'sortPlaylist', id:'playlistSort', items: my_playlists.slice().filter( x => x.owner.display_name === user_info.display_name || x.collaborative ) })
        } else {
            setActivePlaylistItem( {} )
        }
    }, [ activeManageItem ])


    const sortBarTrans = useSpring({
        transform: sortBar ? 'translateY(0%)' : 'translateY(100%)'
    })

    const activeItemTrans = useTransition( activeManageItem, {
        initial: { bottom: 0 - window.innerHeight, minHeight: (height - resizePos) } ,
        from: { bottom: 0 - window.innerHeight, minHeight: (height - resizePos) },
        update: { minHeight: (height - resizePos) } ,
        enter: { bottom: 0 , minHeight: (height - resizePos)  },
        leave: { bottom: 0 - window.innerHeight, minHeight: (height - resizePos) },

    })

    const playlistTrans = useTransition( activePlaylistItem, {
        initial: { top: 0 - window.innerHeight, minHeight: resizePos },
        from: {  top: 0 - window.innerHeight, minHeight: resizePos},
        update: { minHeight: resizePos } ,
        enter: {  top: 0 ,   minHeight: resizePos },
        leave: {  top: 0 - window.innerHeight, minHeight: resizePos,}
    })

    const handleCloseSortContainer = () => {
        setActivePlaylistItem( {} )
        setActiveManageItem( {} )
    }

    const breakDownId = (str) =>{
        const split = '--'
        const id = str.split('--')
        return id
        
    } 

    const dragEnd = (e) => {
        setDragging( undefined )
        if( e.destination){
            const destination = e.destination.droppableId.split('--')
            if( e.destination.droppableId === e.source.droppableId ){
                if( destination[0] === 'top'){
                    const result = moveIndex( e.source.index, e.destination.index , topItems.slice())
                    originalTopItemsRef.current = originalTopItemsRef.current.filter( x => x !== `top--${result[ e.destination.index].id }`)
                    console.log( result)
                    setTopItems( result )
                }else if( destination[0] === 'bottom' ){
                    if( activeManageItem.type === 'playlist' &&
                        (activeManageItem.collaborative ||
                        activeManageItem.owner.display_name === user_info.display_name  )){
                            const result = moveIndex( e.source.index, e.destination.index, bottomItems.slice() )
                            originalBottomItemsRef.current = originalBottomItemsRef.current.filter( x => x !== `bottom--${result[ e.destination.index].id }`)

                            setBottomItems( result )
                    }
                }
            } else {
                if( destination[0] === 'top'){
                    const result = moveIndexBetween( e.source.index, bottomItems.slice() , e.destination.index , topItems.slice() )
                    setTopItems( result[1] )
                    if( activeManageItem.type === 'playlist' &&
                        (activeManageItem.collaborative ||
                        activeManageItem.owner.display_name === user_info.display_name  )){
                        setBottomItems( result[0] )
                    }
                    
                }else if( destination[0] === 'bottom' ){
                    if( activeManageItem.type === 'playlist' &&
                        (activeManageItem.collaborative ||
                        activeManageItem.owner.display_name === user_info.display_name  )){
                            const result = moveIndexBetween( e.source.index, topItems.slice() , e.destination.index , bottomItems.slice() )
                            setTopItems( result[0] )
                            setBottomItems( result[1])

                    }
                } else if( destination[0] === 'playlist'){
                    if( activeManageItem.type === 'playlist' &&
                        (activeManageItem.collaborative ||
                        activeManageItem.owner.display_name === user_info.display_name  )){
                            const result = removeItem( e.source.index, bottomItems.slice() )
                            console.log( result )
                            setBottomItems( result )
                    }
                }
            }
        }
         
    }

    const removeItem = ( from, arr ) => {
        const item = arr.splice( from, 1 )[0]
        return arr
    }

    const moveIndexBetween = ( from, arr1, to, arr2 ) => {
        const item = arr1.splice( from, 1 )[0]
        arr2.splice( to, 0, item )
        return [ arr1, arr2 ]
    }

    const moveIndex = ( from, to, arr ) => {
        const item = arr.splice( from, 1 )[0]
        arr.splice( to, 0, item)
        return arr
    }

    const dragUpdate = (e) => {
    }

    const dragStart = (e) => {
        setDragging( e.draggableId )
    } 

    const handleReorder = () => {

    }

    return(  
        <animated.div style={ style } className='sortContainer'>
       
        <DragDropContext 
        onDragStart={ dragStart }
        onDragUpdate={ dragUpdate }
        onDragEnd={ dragEnd } >
            <div 
            ref={ sortContainerRef }
            className='sortContainer__relative'>
                <div id="draggable"></div>

        {
            playlistTrans(( props, item) => (
                item.type &&
                <ActiveItem 
                clickLoc={ clickLoc }
                setClickLoc={ setClickLoc }
                orientation={ 'top'} 
                dragging={ dragging } 
                style={ props } 
                data={ item } 
                setActiveItem={ setActivePlaylistItem } 
                items={ topItems }
                setItems={ setTopItems }
                originalItemsRef={ originalTopItemsRef }
                />
            ))
        }
            <ResizeBar 
            parentHeight={ height }
            resizePos={ resizePos } 
            setResizePos={ setResizePos } />
        {
        activeItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem 
            clickLoc={ clickLoc }
            setClickLoc={ setClickLoc }
            orientation={ 'bottom'} 
            dragging={ dragging } 
            style={ props } 
            data={ item } 
            setActiveItem={ setActiveManageItem }
            items={ bottomItems }
            setItems={ setBottomItems } 
            originalItemsRef={ originalBottomItemsRef }/>
        ))
        }
            </div>
        </DragDropContext>
        <animated.div style={ sortBarTrans } className='sortContainer__controls'>
            <button
            className='sortContainer__close' 
            onClick={ handleCloseSortContainer } c>
                <i className="fas fa-chevron-left"></i>
                <span> Back </span>
            </button>
            <button onClick={ () => setSortBar( false )}>
                <i className="fas fa-music"></i>
                <span> Player </span>
            </button>
        </animated.div>
        </animated.div>
    )
}

export default SortContainer