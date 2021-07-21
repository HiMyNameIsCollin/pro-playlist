import { useState, useEffect, useContext, useRef } from 'react'
import { DbFetchedContext } from '../Dashboard'

import ManageCard from './ManageCard'

const ManageContainer = ({ setManageOverlay, data, likedPlaylist, sort, manageContainerListTypeRef }) => {
    
    const [ listType, setListType ] = useState( manageContainerListTypeRef.current )

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
        <div className='mngContainer'>
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
                <ManageCard item={ likedPlaylist } listType={ listType }/>
            }
            {
                data.map( item => {
                   return <ManageCard item={ item } listType={ listType } />
                })
            }
        </div>
    )
}

export default ManageContainer 