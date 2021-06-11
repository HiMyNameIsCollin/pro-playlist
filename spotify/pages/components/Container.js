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
      const sessionFinished = () => {
        const access_token = localStorage.removeItem('access_token')
        const refresh_token = localStorage.removeItem('refresh_token')
        const token_expiry = localStorage.removeItem( 'token_expiry' )
      }
      // window.onbeforeunload = sessionFinished
    },[])

    useEffect(() => {
      const access_token = localStorage.getItem('access_token')
      if( access_token  ) {
        const token_expiry = localStorage.getItem( 'token_expiry' )
        const expired = checkToken( token_expiry )
        if( !expired ) setAuth(true)
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