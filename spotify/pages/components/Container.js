import Login from './Login'
import Dashboard from './Dashboard'
import {useState, useEffect} from 'react'
import { checkToken, refreshToken } from '../../utils/tokenTools'
import useFetchToken from '../../hooks/useFetchToken'

const Container = () => {
    const TOKENURL = 'https://accounts.spotify.com/api/token'

    const useFetchTokenHook = useFetchToken(TOKENURL)
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchTokenHook

    const [auth, setAuth] = useState(false)


    useEffect(() => {

      const access_token = localStorage.getItem('access_token')
      if( access_token  ) {
        const token_expiry = localStorage.getItem( 'token_expiry' )
        const expired = checkToken( token_expiry )
        if( expired ){
          const refresh_token = localStorage.getItem('refresh_token')
          refreshToken(refresh_token, setTokenBody)
        }else {
          setAuth(true)
        }
      }
    },[ tokenFetchComplete ])

    return(
    <main className='container'>
      {
        auth ?
        <Dashboard setAuth={ setAuth } /> :
        <Login useFetchToken={ useFetchTokenHook }/>
      }
    </main>    
    )
}

export default Container