import { useState, useEffect, useContext, useRef } from 'react'
import { DbFetchedContext, DbHookContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import ManageCard from './ManageCard'

const ManageLibrary = ({ transitionComplete, setTransitionComplete, setManageOverlay, data, likedPlaylist, managerPlaylist, sort, manageContainerListTypeRef }) => {
    
    const thisComponentRef = useRef()

    const { activeManageItem } = useContext( ManageHookContext )
    const [ listType, setListType ] = useState( manageContainerListTypeRef.current )

    useEffect(() => {
        setTransitionComplete( true )
    },[])

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete( false )
        }
    },[ transitionComplete ])

    const handleListType = () => {
        let lt
        if( listType === 'bar' ){
            lt = 'square'
        } else {
            lt = 'bar'
        }
        setListType( lt )
        manageContainerListTypeRef.current = lt
    }

    const handleManageOverlay = () => {
        const mngOverlay = {
            type: 'Sort'
        }
        setManageOverlay( mngOverlay )
    }


    return(
        <div
        ref={ thisComponentRef }
        className='mngLibrary'>
            <div className='sortByBar'>
                <div onClick={ handleManageOverlay } className='sortByBar__btn'>
                    <i className="fas fa-sort"></i>
                    <span>
                        { sort }
                    </span>
                </div>
                <div onClick={ handleListType }>
                {
                    listType === 'bar' ?
                    <i className="fas fa-bars"></i> :
                    <i className="fas fa-th-large"></i>
                } 
                </div>
            </div>
            {
                likedPlaylist &&
                <ManageCard item={ likedPlaylist } listType={ listType } />
            }
            {
                managerPlaylist &&
                <ManageCard item={ managerPlaylist } listType={ listType } />
            }
            {
                data.map(( item, i ) => {
                   return <ManageCard item={ item } key={ i } listType={ listType } />
                })
            }
        </div>
    )
}

export default ManageLibrary