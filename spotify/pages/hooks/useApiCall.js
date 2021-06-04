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
    const fetchApi = ( route, method, requestID, body,  ) => {
        const errorHandling = (err) => {
            console.log(err, 1234)
            setApiError(true)
            setApiPending(false)
            if(err.status === 401){
                const refresh_token = localStorage.getItem('refresh_token')
                refreshToken( refresh_token, setTokenBody )
            }
        }
        thisCallRef.current = ({ route, method, body, requestID})
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
                data['route'] = breakdownRoute(route, data.id ? data.id : requestID)
                data['method'] = method
                setApiPayload(data)
                setApiPending(false)
            }
        })
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

    useEffect(() => {
        if(tokenFetchComplete){
            const { route, method, body } = thisCallRef.current
            fetchApi( route, method, body )
            setTokenFetchComplete(false)
        } 
    },[ tokenFetchComplete ])

    return { fetchApi, apiError, apiIsPending, apiPayload }
}

export default useApiCall