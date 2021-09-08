import { useState, useEffect } from 'react'
import { handleAuthorizationResponse } from '../../utils/tokenTools'
const useFetchToken = (url) => {
    const [tokenBody, setTokenBody] = useState(null)
    const [tokenError, setTokenError] = useState(null)
    const [tokenIsPending, setTokenIsPending] = useState(false)
    const [tokenFetchComplete, setTokenFetchComplete] = useState(false)

    useEffect(() => {        
        if(tokenBody){
          console.log( url )
          setTokenIsPending(true)
          setTokenError(false)
          fetch(`${url}api/token`, {
            method: 'post',
            headers: {
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify({tokenBody,})
          })
          .then(data => data.json())
          .then(data => {handleAuthorizationResponse(data), setTokenFetchComplete(true), setTokenIsPending(false), setTokenBody(null)})
          .catch(err => {
            console.log(err, 123 )
            setTokenError(true)
            setTokenIsPending(false)
            setTokenBody(null)
          })
        }

    },[tokenBody])
    return { tokenError, tokenIsPending, tokenFetchComplete, setTokenFetchComplete, setTokenBody }
}

export default useFetchToken