import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { animated, useTransition, useSpring } from 'react-spring'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { DbFetchedContext, DbHookContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'
import ResizeBar from './ResizeBar'

const SortContainer = ({ style, setActiveItem,  }) => {

    const route = 'v1/playlists/tracks'

    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(  )
    const { sortBar, setSortBar, setMessageOverlay, refresh } = useContext( DbHookContext )
    const { my_playlists, user_info } = useContext( DbFetchedContext )
    const { activeManageItem, setActiveManageItem,} = useContext( ManageHookContext )
    const [ activePlaylistItem, setActivePlaylistItem ] = useState({})

    const [ bottomItems, setBottomItems ] = useState( [] )
    const [ topItems , setTopItems ] = useState( [] )

    const [ dragging, setDragging ] = useState( false )
    const [ height, setHeight ] = useState( window.innerHeight )
    const [ resizePos, setResizePos ] = useState(0)
    const [ clickLoc, setClickLoc ] = useState( 0 )
    const originalBottomItemsRef = useRef( [] )
    const originalTopItemsRef = useRef( [] )


    const sortContainerRef = useCallback(node => {
        if ( node ) {
            setHeight( node.getBoundingClientRect().height )
        }
        return () => setHeight( 0 )
      }, []);

      useEffect(() => {
          setSortBar( true )
          return () => {
            refresh('my_playlists')  
            setSortBar( false )
          }
      },[])

      useEffect(() => {
        if( apiPayload ) {
            console.log( apiPayload )
        }
      },[ apiPayload ])

    useEffect(() => {
        if(activeManageItem.type){
            //  Default setting for the playlist menu. Renders slider that to display all playlists.
            if( !activePlaylistItem.type) setActivePlaylistItem({ type:'sortPlaylist', id:'playlistSort', items: my_playlists.slice().filter( x => (x.owner.display_name === user_info.display_name || x.collaborative) && x.id !== activeManageItem.id ) })
        } else {
            setActivePlaylistItem( {} )
        }
    }, [ activeManageItem ])


    const sortBarTrans = useSpring({
        transform: sortBar && activeManageItem.type ? 'translateY(0%)' : 'translateY(100%)'
    })

    const activeItemTrans = useTransition( activeManageItem, {
        from: { bottom: 0 - window.innerHeight, minHeight: (height ? height : window.innerHeight )- (resizePos ? resizePos : window.innerHeight / 2) },
        update: { minHeight: ((height ? height : window.innerHeight )- ( resizePos ? resizePos : window.innerHeight / 2 )) } ,
        enter: { bottom: 0 , minHeight: (height ? height : window.innerHeight )- (resizePos ? resizePos : window.innerHeight / 2 )   },
        leave: { bottom: 0 - window.innerHeight, minHeight: (height ? height : window.innerHeight )- (resizePos ? resizePos : window.innerHeight / 2 )  },
    })

    const playlistTrans = useTransition( activePlaylistItem, {
        from: {  top: 0 - window.innerHeight, minHeight: resizePos ? resizePos : window.innerHeight / 2},
        update: { minHeight: resizePos ? resizePos : window.innerHeight / 2 } ,
        enter: {  top: 0 ,   minHeight: resizePos  ? resizePos : window.innerHeight / 2 },
        leave: {  top: 0 - window.innerHeight, minHeight: resizePos ? resizePos : window.innerHeight / 2,}
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

    const dragUpdate = (e) => {
        console.log( e.destination )
    }

    const dragStart = (e) => {
        setDragging( e.draggableId )
    } 


    const dragEnd = (e) => {
        setDragging( undefined )
        if( e.destination){
            const dest = e.destination.droppableId.split('--')
            if( e.source.droppableId === e.destination.droppableId ) {
                const collection = dest[0] === 'top' ? activePlaylistItem : activeManageItem
                const tracks = dest[0] === 'top' ? topItems : bottomItems
                const setItemsFunc = dest[0] === 'top' ? setTopItems : setBottomItems
                const result = moveIndex( e.source.index, e.destination.index , { collection, tracks: tracks.slice() })
                if( dest[0] === 'top' ){
                    originalTopItemsRef.current = originalTopItemsRef.current.filter( x => x !== `top--${result[ e.destination.index].id }`)
                }else {
                    originalBottomItemsRef.current = originalBottomItemsRef.current.filter( x => x !== `bottom--${result[ e.destination.index].id }`)
                }
                setItemsFunc( result )
            } else {
                const destPlaylist = dest[0] === 'top' ? activePlaylistItem : activeManageItem
                const destTracks = dest[0] === 'top' ? topItems : bottomItems
                const sourcePlaylist = dest[0] === 'top' ? activeManageItem : activePlaylistItem
                const sourceTracks = dest[0] === 'top' ? bottomItems : topItems
                const result = moveIndexBetween( e.source.index, { collection: sourcePlaylist, tracks: sourceTracks.slice() }, e.destination.index, { collection: destPlaylist, tracks: destTracks.slice() })
                if( dest[0] === 'top' ){
                    originalBottomItemsRef.current = originalBottomItemsRef.current.filter( x => x !== `bottom--${ bottomItems[ e.source.index].id }`)
                    setTopItems( result.dest )
                    setBottomItems( result.source )
                } else {
                    originalTopItemsRef.current = originalTopItemsRef.current.filter( x => x !== `top--${topItems[ e.source.index ].id }`)
                    setBottomItems( result.dest )
                    setTopItems( result.source )
                }
                const message = `${ result.dest[ e.destination.index ].name } added to ${ destPlaylist.name }`
                setMessageOverlay( m => m = [ ...m, message ])
            }
        }
    }

    const moveIndexBetween = ( from, source, to, dest ) => {
        const removedResult = removeItem( from, source )
        dest.tracks.splice(to, 0, removedResult.item )
        const uris = dest.tracks.map(( item, i ) => item.uri ? item.uri : item.track.uri )
        const body = {
            "uris": uris, 
        }
        finalizeRoute('put', `${ route.substr( 0, 12 ) }/${ dest.collection.id }/tracks`, dest.collection.id, null, body, )
        return { dest: dest.tracks, source: removedResult.tracks}
    }


    const removeItem = ( from, data ) => {
        const { collection, tracks } = data
        let result
        let item
        if( verifyDrop( collection ) ){
            item = tracks.splice( from, 1 )[0]
            result = { tracks: tracks, item: item }
            const body = {
                "tracks": [{ "uri": `${item.uri ? item.uri : item.track.uri }` } ]
            }
            finalizeRoute('delete', `${route.substr(0, 12)}/${collection.id}/tracks`, collection.id, null, body)
        } else{
            item = { ...tracks[from] }
            result = { tracks: tracks, item: item }
        }
        return result 
    }

    const verifyDrop = ( collection ) => {
        if( collection.type === 'playlist' &&
        collection.id !== 1 && collection.id !== 2 &&
        (collection.collaborative || collection.owner.display_name === user_info.display_name) ){
            return true
        } else {
            return false
        }
    }

    const moveIndex = ( from, to, data ) => {
        const { collection, tracks } = data
        const body = {
            "range_start": from,
            "insert_before": to,
            "range_length": 1
        }
        finalizeRoute('put', `${route.substr( 0, 12 )}/${collection.id}/tracks`, null, null, body )
        const item = tracks.splice( from, 1 )[0]
        tracks.splice( to, 0, item)
        return tracks
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
            onClick={ handleCloseSortContainer }>
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