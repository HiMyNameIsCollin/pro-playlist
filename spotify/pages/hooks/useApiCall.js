import { useState, useEffect, useRef } from 'react'
import useFetchToken from './useFetchToken'
import { checkToken, refreshToken } from '../../utils/tokenTools'

const useApiCall = (url) => {
    // const [fetchQueue, setFetchQueue] = useState([])
    const [apiError, setApiError] = useState(false)
    const [apiIsPending, setApiPending] = useState(false)
    const [apiPayload, setApiPayload] = useState(null)
    const host = location.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://proplaylist-himynameiscollin.vercel.app/'
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenFetchComplete, setTokenBody } = useFetchToken(host)
    const thisCallRef = useRef()
    const awaitingResultsRef = useRef()
    const fetchApi = ( route, method, requestID, fetchAll, body,  ) => {
        const errorHandling = (err) => {
            console.log(err, 1234)
            setApiError(true)
            setApiPending(false)
            if(err.status === 401){
                const refresh_token = localStorage.getItem('refresh_token')
                refreshToken( refresh_token, setTokenBody )
            }
        }
        thisCallRef.current = { route, method, body, requestID}
        setApiPending(true)
        setApiError(false)
        const access_token = localStorage.getItem('access_token')
        fetch(`${ url }${ route }`, {
            method: method,
            headers: {
                'Content-Type' : 'application/json',
                authorization: `Bearer ${access_token}`,
            },
            body: body && body
        })
        .then(data => data.json())
        .then(data => {
            if(data.error){
                errorHandling(data.error)
            }else{
                const result = finalizePayload( method, route, requestID, data, )
                if( fetchAll ){
                    console.log(data)
                    if(awaitingResultsRef.current){
                        result.items = [ ...awaitingResultsRef.current.items, ...result.items ]
                        awaitingResultsRef.current = result
                    } else {
                        awaitingResultsRef.current = result
                    }
                    if( result.next ) {
                        fetchAgain( requestID, result )
                    }
                    if( !result.next ) {
                        const payload = awaitingResultsRef.current
                        setApiPayload( payload )
                        setApiPending( false )
                        awaitingResultsRef.current = undefined
                    }
                } else {
                    setApiPayload( result )
                    setApiPending( false )
                }
            }
        })
    }

    const fetchAgain = ( id, data ) => {
        const args = getQueries( data.next )
        const newArgs = compareArgs( args, data.queries )
        const stringifiedArgs = args.map( a => {
            const keys = Object.keys(a)
            return `${ keys[0] }=${a[keys[0]]}`
        })
        
        finalizeRoute( data.method, data.route, id, true, ...stringifiedArgs)
        
    }

    const compareArgs = ( arr1, arr2 ) => {
        let args = []
        if( arr2 ){
            arr2.forEach( a => {
                const keys = Object.keys( a )
                const found = arr1.find( x => x[keys[0]] ) 
                if( !found ) args.push( a )
            })
        }
        args = [ ...arr1, ...args ]
        return args 

    }

    const getQueries = ( str ) => {
        let queries = []
        const urlParams = new URLSearchParams(str)
        const params = Object.fromEntries(urlParams.entries())
        const keys = Object.keys( params )
        keys.forEach(( key, i ) => {
            let arg = {} 
            if(key.includes('?')){
                const result = breakdownRoute( key )
                const keyOfValue = Object.values(result.query[0])
                arg[keyOfValue] = params[key]
            } else {
                arg[key] = params[key]
            }
            queries.push( arg )
        })
        return queries
    }

    // const fetchAgain = ( id, data ) => {
    //     const args = getQueries( data.next )
    //     
    //     if(!data.route) console.log(data)
    //     finalizeRoute( data.method, data.route, id, true, ...args)

    // }
    const finalizePayload = ( method, thisRoute, requestID, data ) => {
        if( method === 'get' ){
            let result = {}
            const brokeDownRoute = breakdownRoute( thisRoute, data.id ? data.id : requestID)
            if( data['genres'] || data['display_name'] || data['items'] || data['type'] && data['type'] === 'track'){
                result = data 
            } else {
                for( let key of Object.keys(data) ){
                    if( typeof data[ key ] === 'object')
                    result = { ...data[ key ] }
                }
            }
            result['route'] = brokeDownRoute.route
            result['queries'] = brokeDownRoute.query
            result['method'] = method 
            return result
        }
    }

    const breakdownQuery = ( str ) => {
        const regexp = /['=']/
        const arr = str.split( '&' )
        let args = []
        arr.forEach( a => {
            const equalIndex = a.search( regexp )
            let result = {}
            result[`${ a.slice( 0, equalIndex )}`] = a.slice( equalIndex + 1 )
            args.push(result)
        })
        
        return args 
        

    }

    const breakdownRoute = ( thisRoute, id ) => {
        const regexp = /['?']/
        const queryIndex = thisRoute.search( regexp )
        let newRoute
        let query
        if( queryIndex > -1 ){
            query = breakdownQuery( thisRoute.slice( queryIndex + 1 ) )
            newRoute = thisRoute.slice( 0, queryIndex  )
        } else {
            newRoute = thisRoute
        }
        return { route: newRoute, query: query}
    }

    const finalizeRoute = (method, route, requestID, fetchAll, ...args) => {
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
        fetchApi( finalRoute, method , requestID, fetchAll)
    }

    useEffect(() => {
        if(tokenFetchComplete){
            const { route, method, body } = thisCallRef.current
            fetchApi( route, method, body )
            setTokenFetchComplete(false)
        } 
    },[ tokenFetchComplete ])

    return { finalizeRoute, apiError, apiIsPending, apiPayload }
}

export default useApiCall