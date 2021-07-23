import { useState, useEffect, useContext, useReducer, useRef } from 'react'
import { animated, useTransition } from 'react-spring'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'


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



const SortContainer = () => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem } = useContext( ManageHookContext )


    const sortContainerActiveItemTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )' },
        from: { transform: 'translateY( 100% )' },
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' }
    })

    return(        
        sortContainerActiveItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem style={ props } data={ item }/>
        ))
    
            
      
    )
}

export default SortContainer