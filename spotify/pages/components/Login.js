import Image from 'next/image'
import {useState, useEffect} from 'react'

// USING NEXT ROUTER TO CLEAR URL INSTEAD OF REACT ROUTER BECAUSE ITS EZPZ.
import { useRouter } from 'next/router'


const Login = ({ useFetchToken }) => {
    const router = useRouter()    
    const authorize = 'https://accounts.spotify.com/authorize'
    const redirect_uri = location.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://proplaylist-himynameiscollin.vercel.app/'

    const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchToken

    const initAuth = () => {
      let url = authorize
      url += "?client_id=" + process.env.NEXT_PUBLIC_CLIENT_ID
      url += "&response_type=code"
      url += "&redirect_uri=" + encodeURI(redirect_uri)
      url += "&show_dialog=true"
      url += "&scope=user-read-private"
      url += ' '
      url += 'playlist-modify-public'
      url += ' '
      url += 'playlist-modify-private'
      url += ' '
      url += 'playlist-read-private'
      url += ' '
      url += 'user-library-read'
      url += ' '
      url += 'user-library-modify'
      url += ' '
      url += 'playlist-read-collaborative'
      url += ' '
      url += 'user-read-recently-played'
      url += ' '
      url += 'user-top-read'

      window.location.href=url
    }
    
    const handleRedirect = () => {
      let code = getCode()
      if( code ) initTokenFetch( code )
      clearUrl()
    }
  
    const clearUrl = () => {
      router.push('/')
    }
    
    const getCode = () => {
      let code = null
      const queryString = window.location.search
      if(queryString.length >0){
        const urlParams = new URLSearchParams(queryString)
        code = urlParams.get('code')
      }
      return code
    }
    
    const initTokenFetch = ( code ) => {
      let body = 'grant_type=authorization_code'
      body += '&code=' + code
      body += '&redirect_uri=' + encodeURI(redirect_uri)
      body += '&client_id=' + process.env.NEXT_PUBLIC_CLIENT_ID
      body += '&client_secret=' + process.env.NEXT_PUBLIC_CLIENT_SECRET
      setTokenBody(body)
    }
  
    useEffect(() => {
      if(window.location.search.length > 0){
          handleRedirect()
      }
    }, [])
    return(
        <section className='wrapper'>
          <div className='login'>
              <div className='login__icon'>
                  <Image 
                      src='/Spotify_Icon_RGB_Green.png'
                      height={64}
                      width={64} />
              </div>
              <h1 className='login__brand'>
                  Pro Playlist
              </h1>
              <button className='login__btn' onClick={initAuth}>
                  Login with Spotify
              </button>
              <p>
                  Powered by
              </p>
              <div className='login__logo'>
                  <Image 
                      src='/Spotify_Logo_RGB_Green.png'
                      layout='fill'/>
              </div>
          </div>
        </section>

    )
}

export default Login