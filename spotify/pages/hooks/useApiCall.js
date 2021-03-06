import { useState, useEffect, useRef } from 'react'
import useFetchToken from './useFetchToken'
import { checkToken, refreshToken } from '../../utils/tokenTools'

const useApiCall = () => {

    const url = 'https://api.spotify.com/'
    
    const [apiError, setApiError] = useState(false)
    const [apiIsPending, setApiPending] = useState(false)
    const [apiPayload, setApiPayload] = useState(null)
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenFetchComplete, setTokenBody } = useFetchToken( `${window.location.origin}/` )
    const thisCallRef = useRef( [] )

    const fetchApi = ( route, method, requestID, config, body,  ) => {
        const errorHandling = (err) => {
            console.log(err, 1234)
            setApiError(true)
            setApiPending(false)
            if(err.status === 401){
                const refresh_token = localStorage.getItem('refresh_token')
                refreshToken( refresh_token, setTokenBody )
            }
        }
        thisCallRef.current = [ ...thisCallRef.current, { route, method, requestID, config, body, } ]
        setApiPending(true)
        setApiError(false)
        const access_token = localStorage.getItem('access_token')
        fetch(`${ url }${ route }`, {
            method: method,
            headers: {
                'Content-Type' : 'application/json',
                authorization: `Bearer ${access_token}`,
            },
            body: body ? JSON.stringify(body) : undefined
        })
        .then(data => data.json())
        .then(data => {
            if(data.error){
                errorHandling(data.error)
            }else{
                data['route'] = breakdownRoute(route, data.id ? data.id : requestID)
                data['method'] = method
                if(method !== 'get'){
                    data['id'] = data.id ? data.id : requestID 
                }
                if( config && config.fetchAll ){
                    const next = fetchNext( data, requestID )
                    if( next ){
                        finalizeRoute( data.method, next.substr( url.length ), requestID, config )
                    } 

                }
                thisCallRef.current = thisCallRef.current.filter( x => x.route !== route )
                setApiPayload(data)
                setApiPending(false)
            }
        })
    }

    const fetchNext = ( data, id ) => {
        let next = searchObject( data, 'next' )
        if(next) {
            const cursors = searchObject( data, 'cursors' )
            if(cursors){
                const newNext = next.replace(`${ cursors.before }`, `${ cursors.after }`)
                next = newNext
            }
            // finalizeRoute( data.method, next.substr( url.length ), id, true)
        }
        return next
    }

    const searchObject = ( data, key ) => {
        let found 
        const keys = Object.keys( data )
        const foundKey = keys.find( x => x === key )
        if( foundKey ) return data[ foundKey ]
        if( !foundKey ){
            const values = Object.values( data )
            values.forEach((v, i) => {
                if( v &&  typeof v === 'object'){
                    if( !Array.isArray(v) ){
                        const vkeys = Object.keys(v)
                        vkeys.forEach(( vk, j ) => {
                            if( vk === key ){
                                found = v[vk]
                                return
                            } else {
                                if( typeof v[vk] === 'object' && !Array.isArray(v[vk])){
                                    searchObject(vk, key )
    
                                }
                            }
                        })
                    }
                }
            })
        }
        if(found){
            return found
        }
    }

    const breakdownRoute = (route , id) => {
        // Check for queries and remove them
        let newRoute 
        if(route.includes('?')){
            const regexp = /['?']/
            const queryIndex = route.search(regexp)
            newRoute = route.substr(0, queryIndex)
        } else {
            newRoute = route
        }
        let finalRoute
        // Check route to see if its dynamic, if so make it static for reducer reference
        if(newRoute.includes(id)){
            finalRoute = newRoute.replace(`/${id}`, '')
            return finalRoute
        }else{
            
            finalRoute = newRoute
            return finalRoute
        }
    }

    const finalizeRoute = (method, route, requestID, fetchAll, body,  ...args) => {
    let finalRoute = route
    if(args.length > 0){
        args.forEach((arg, i) => {
            if( i === 0 ) {
                finalRoute += `?${arg}`
            }else {
                finalRoute += `&${arg}`
            }
        })
    }
    fetchApi( finalRoute, method , requestID, fetchAll, body)
}

    useEffect(() => {
        if(tokenFetchComplete){
            thisCallRef.current.forEach( call => {
                fetchApi( call.route, call.method, call.requestID, call.config, call.body )
            })
            thisCallRef.current = []
            setTokenFetchComplete(false)
        } 
    },[ tokenFetchComplete ])

    return { finalizeRoute, apiError, apiIsPending, apiPayload, setApiPayload }
}

export default useApiCall