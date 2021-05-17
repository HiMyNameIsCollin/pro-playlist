import { useState, useEffect, useRef } from 'react'
import useFetchToken from './useFetchToken'
import { checkToken, refreshToken } from '../utils/tokenTools'

const useApiCall = (url) => {
    // const [fetchQueue, setFetchQueue] = useState([])
    const [apiError, setApiError] = useState(false)
    const [apiIsPending, setApiPending] = useState(false)
    const [apiPayload, setApiPayload] = useState(null)
    const TOKENURL = 'https://accounts.spotify.com/api/token'
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchToken(TOKENURL)
    const thisCallRef = useRef()
    const fetchApi = ( route, method, body ) => {
        const errorHandling = (err) => {
            console.log(route)
            console.log(err, 1234)
            setApiError(true)
            setApiPending(false)
            if(err.status === 401){
                const refresh_token = localStorage.getItem('refresh_token')
                refreshToken( refresh_token, setTokenBody )
            }
        }
        thisCallRef.current = ({ route, method, body, })
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
                data['route'] = breakdownRoute(route)
                data['method'] = method
                setApiPayload(data)
                setApiPending(false)
            }
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
        if(tokenFetchComplete){
            const { route, method, body } = thisCallRef.current
            fetchApi( route, method, body )
        } 
    },[ tokenFetchComplete ])

    return { fetchApi, apiError, apiIsPending, apiPayload }
}

export default useApiCall