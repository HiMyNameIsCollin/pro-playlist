import Login from './Login'
import Dashboard from './Dashboard'
import {useState, useEffect, useRef } from 'react'
import { checkToken, refreshToken } from '../../utils/tokenTools'
import useFetchToken from '../hooks/useFetchToken'
import LoadingLogo from './LoadingLogo'
import { useTransition } from 'react-spring'
import { useRouter } from 'next/router'

const Container = () => {

  const redirect_uri = `${window.location.origin}/`

  const { tokenError, tokenIsPending, tokenFetchComplete, setTokenBody } = useFetchToken( redirect_uri )
  const audioRef = useRef()
  const [ auth, setAuth ] = useState(false)
  const [ height, setHeight ] = useState()
  const [ loaded, setLoaded ] = useState( false )
  const router = useRouter()    

  useEffect(() => {
    let isMounted = true
    if( isMounted ){
      setHeight( window.innerHeight )
      window.addEventListener( 'resize', () => {
        setHeight( window.innerHeight )
      })
      window.addEventListener( 'orientationchange', () => {
        setHeight( window.innerHeight )
      })
    }
    return () => isMounted = false  
  }, [])

  useEffect(() => {
    const checkAuth = () => {
      const access_token = localStorage.getItem('access_token')
      if( access_token ) {
        const token_expiry = localStorage.getItem( 'token_expiry' )
        const expired = checkToken( token_expiry )
        if( !expired ){
          initAudio()
          setAuth(true)
        } else {
          // const refresh_token = localStorage.getItem('refresh_token')
          // refreshToken(refresh_token, setTokenBody)
          localStorage.removeItem('access_token')
          setLoaded(true)
        }
      } else {
          if(window.location.search.length > 0){
            handleRedirect()
          } else {
            setLoaded( true )
          }
      }      
    }
    setTimeout( checkAuth, 250 )
  },[ tokenFetchComplete ])

  const handleRedirect = () => {
    let code = getCode()
    clearUrl()
    if( code ) initTokenFetch( code )
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


  const initAudio = () => {
    const sound = new Audio('../../silence.mp3')
    audioRef.current = sound
  }

  const loadingTrans = useTransition( loaded, {
    from: { opacity: 1 } ,
    enter: { opacity: 1 } ,
    leave: { opacity: 0, delay: 1000 } ,
  })

    return(
    <>
      
      <div
      style={{ display: window.innerHeight > window.innerWidth ? 'none' : 'flex' , }} 
      className='orientation'>
        <p> This project is designed for mobile devices in portrait orientation. </p> 
      </div>
      
      <main 
      style={{
        display: window.innerHeight > window.innerWidth ? 'block' : 'none' ,
        minHeight: height, 
      }}
      className='container'>
          {
            loadingTrans( ( props, item ) => (
              !item &&
              <LoadingLogo style={ props }/>
            ))
          }
          {
            auth ? 
            <Dashboard 
            audioRef={ audioRef } 
            setLoaded={ setLoaded }
            height={ height } />  : 
            loaded &&
            <Login setTokenBody={ setTokenBody } initAudio={ initAudio }/>
          }

      </main> 
    </>   
    )
}

export default Container