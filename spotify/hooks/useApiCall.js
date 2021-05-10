import { useState, useEffect } from 'react'
import useFetchToken from './useFetchToken'
import { checkToken, refreshToken } from '../utils/tokenTools'

const useApiCall = (url) => {
    const [fetchQueue, setFetchQueue] = useState([])
    const [method, setMethod] = useState(null)
    const [routes, setRoutes] = useState(null)
    const [body, setBody] = useState(null)
    const [apiError, setApiError] = useState(false)
    const [apiIsPending, setApiPending] = useState(false)
    const [apiPayload, setApiPayload] = useState(null)
    const TOKENURL = 'https://accounts.spotify.com/api/token'
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchToken(TOKENURL)
    const fetchApi = (url, routes, method, body) => {
        const errorHandling = (err) => {
            console.log(err, 1234)
            setApiError(true)
            setApiPending(false)
            setMethod( null )
            setRoutes( null )
        }
        setApiPending(true)
        setApiError(true)

        const access_token = localStorage.getItem('access_token')
        fetch(`${url}${routes}`, {
            method: method,
            headers: {
                'Content-Type' : 'application/json',
                authorization: `Bearer ${access_token}`,
            },
            body: body ? body : null
        })
        .then(data => data.json())
        .then(data => {
            if(data.error){
                errorHandling(data.error)
            }else{
                data['route'] = breakdownRoute(routes)
                setApiPayload(data)
                setApiPending(false)
                setMethod( null )
                setRoutes( null )
            }
        })
        .catch(err => {
            errorHandling(err)
        })
    }

    const breakdownRoute = (route) => {
        if(route.includes('?')){
            const regexp = /['?']/
            const queryIndex = route.search(regexp)
            return route.substring(0, queryIndex)
        } else {
            return route
        }
    }

    useEffect(() => {
        if(method && routes){
            const refresh_token = localStorage.getItem('refresh_token')
            const expired = checkToken(refresh_token)
            if (expired){
                refreshToken( refresh_token, setTokenBody )
            }else {
                if( apiIsPending ) {
                    setFetchQueue( fetchQueue => [...fetchQueue, {routes: routes, method: method}] )
                } else {
                    fetchApi( url, routes, method )
                
                }
            }
        }
    },[ method, routes ])

    useEffect(() => {
        if(fetchQueue.length > 0 && !apiIsPending ) {
            fetchApi( url, fetchQueue[0].routes, fetchQueue[0].method )
            const arr = [...fetchQueue]
            const [x, ...remainder] = arr
            setFetchQueue( remainder )
        } else if(fetchQueue.length === 0){
            setMethod( null )
            setRoutes( null )
        }
    }, [ apiIsPending ])

    useEffect(() => {
        if(tokenFetchComplete){
            fetchApi( url, routes, method )
        } 
    },[ tokenFetchComplete ])

    return { setMethod, setRoutes, fetchQueue, apiError, apiIsPending, apiPayload }
}

export default useApiCall