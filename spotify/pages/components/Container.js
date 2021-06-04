import Login from './Login'
import Dashboard from './Dashboard'
import {useState, useEffect} from 'react'
import { checkToken, refreshToken } from '../../utils/tokenTools'
import useFetchToken from '../hooks/useFetchToken'

const Container = () => {
    const host = location.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://spotify-himynameiscollin.vercel.app/'
    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchToken(host)

    const [ auth, setAuth ] = useState(false)

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
        <Login setTokenBody={ setTokenBody } />
      }
    </main>    
    )
}

export default Container