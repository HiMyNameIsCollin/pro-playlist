import { useState, useEffect } from 'react'
import { handleAuthorizationResponse } from '../utils/tokenTools'
const useFetchToken = (url) => {
    const [tokenBody, setTokenBody] = useState(null)
    const [tokenError, setTokenError] = useState(null)
    const [tokenIsPending, setTokenIsPending] = useState(false)
    const [tokenFetchComplete, setTokenFetchComplete] = useState(false)

    useEffect(() => {        
        if(tokenBody){
          setTokenIsPending(true)
          setTokenError(false)
          fetch(url, {
            method: 'post',
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded ',
              'Authorization' : 'Basic ' + btoa(process.env.NEXT_PUBLIC_CLIENT_ID + ':' + process.env.NEXT_PUBLIC_CLIENT_SECRET)
            },
            body: tokenBody
          })
          .then(data => data.json())
          .then(data => {handleAuthorizationResponse(data), setTokenFetchComplete(true), setTokenIsPending(false), setTokenBody(null)})
          .catch(err => {
            console.log(err)
            setTokenError(true)
            setTokenIsPending(false)
            setTokenBody(null)
          })
        }

    },[url, tokenBody])
    return { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody }
}

export default useFetchToken