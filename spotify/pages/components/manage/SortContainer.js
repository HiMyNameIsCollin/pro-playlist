import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { animated, useTransition, useSpring } from 'react-spring'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { DbFetchedContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'
import ResizeBar from './ResizeBar'

const initialState = {
    tracks: []
}

const reducer = ( state, action ) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method
    }
}



const SortContainer = ({ style, setActiveItem,  }) => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem, setActiveManageItem,} = useContext( ManageHookContext )
    const { my_playlists, user_info } = useContext( DbFetchedContext )
    const [ activePlaylistItem, setActivePlaylistItem ] = useState({})
    const [ dragging, setDragging ] = useState( false )

    const [ height, setHeight ] = useState()
    const [ resizePos, setResizePos ] = useState(0)

    const sortContainerRef = useCallback(node => {
        if (node !== null) {
            console.log(node)
            setHeight( node.getBoundingClientRect().height )
        }
      }, []);

    useEffect(() => {
        if(activeManageItem.type){
            if( !activePlaylistItem.type) setActivePlaylistItem({ type:'sortPlaylist', id:'playlistSort', items: my_playlists.slice().filter( x => x.owner.display_name === user_info.display_name || x.collaborative ) })
        } else {
            setActivePlaylistItem( {} )
        }
    }, [ activeManageItem ])

    const handleCloseSortContainer = () => {
        setActivePlaylistItem( {} )
        setActiveManageItem( {} )
    }

    const activeItemTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )', minHeight: (height - resizePos), marginTop: 'auto', width: '100%' } ,
        from: { transform: 'translateY( 100% )', marginTop: 'auto', minHeight: (height - resizePos) },
        update: { position: 'relative', minHeight: (height - resizePos) } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' , minHeight: (height - resizePos), position: 'absolute', bottom: 0 },
    })

    const playlistTrans = useTransition( activePlaylistItem, {
        initial: { transform: 'translateY( -100% )', minHeight: resizePos, width: '100%' },
        from: { transform: 'translateY( -100% )' , minHeight: resizePos},
        update: { position: 'relative' ,  minHeight: resizePos } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( -100% )', minHeight: resizePos, position: 'absolute', top: 0 }
    })

    const breakDownId = (str) =>{
        const split = '--'
        const id = str.split('--')
        return id
        
    } 

    const dragEnd = (e) => {
        setDragging( undefined )
        console.log(e)
        if( e.destination){
            const id = breakDownId( e.destination.droppableId )
        }
         
    }

    const dragUpdate = (e) => {
    }

    const dragStart = (e) => {
        setDragging( e )
    } 

    return(  
        <animated.div style={ style } className='sortContainer'>
        <div className='sortContainer__close'>
            <button onClick={ handleCloseSortContainer } c>
                <i className="fas fa-chevron-left"></i>
            </button>
        </div>
       
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
                <ActiveItem orientation={ 'top'} dragging={ dragging } style={ props } data={ item } setActiveItem={ setActivePlaylistItem } />
            ))
        }
            <ResizeBar 
            parentHeight={ height }
            resizePos={ resizePos } 
            setResizePos={ setResizePos } />
        {
        activeItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem orientation={ 'bottom'} dragging={ dragging } style={ props } data={ item } setActiveItem={ setActiveManageItem } />
        ))
        }
            </div>
        </DragDropContext>
        </animated.div>
    )
}

export default SortContainer