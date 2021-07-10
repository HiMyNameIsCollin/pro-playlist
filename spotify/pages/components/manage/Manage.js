import { useEffect, useState, useContext, useReducer, useRef } from 'react'
import { useSprings, animated } from 'react-spring'
import useApiCall from '../../hooks/useApiCall'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import ManageFilters from './ManageFilters'
const Manage = () => {

    

    const { user_info } = useContext( DbFetchedContext )
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ activeFilter, setActiveFilter ] = useState( undefined )
    const [ subFilter, setSubFilter ] = useState( false )

    useEffect(() => {
        if( apiPayload ) console.log(apiPayload)
    }, [ apiPayload ])

    return(
        <div id='managePage' className='page'>
            <header className='manageHeader'>
                <div className='manageHeader__top'>
                    <div className='manageHeader__imgContainer'>
                    {
                        user_info.images &&
                        <img src={ user_info.images[0].url } alt={ `${ user_info.display_name }'s profile photo `} />

                    }
                    </div>
                    <h1 className='manageHeader__title'>
                        Manage
                    </h1>
                    <i className="fas fa-search"></i>
                    <i className="fas fa-plus"></i>
                </div>
                
                <ManageFilters activeFilter={ activeFilter } setActiveFilter={ setActiveFilter } subFilter={ subFilter } setSubFilter={ setSubFilter }/>
                
            </header>
        </div>
    )
}

export default Manage