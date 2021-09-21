import Image from 'next/image'
import {useState, useEffect} from 'react'

const Login = () => {
    const authorize = 'https://accounts.spotify.com/authorize'
    const redirect_uri = `${window.location.origin}/`

    const signIn = () => {
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
      url += 'user-follow-read'
      url += ' '
      url += 'user-library-modify'
      url += ' '
      url += 'user-follow-modify'
      url += ' '
      url += 'playlist-read-collaborative'
      url += ' '
      url += 'user-read-recently-played'
      url += ' '
      url += 'user-top-read'
      url += ' '
      url += 'user-read-currently-playing'
      url += ' ' 
      url += 'user-read-playback-state'

      window.location.href=url
    }
    

    return(
        <section className={`login page `}>
          <div className='login__card'>
              <div className='login__icon'>
                  <Image 
                      src='/Spotify_Icon_RGB_Green.png'
                      height={ window.innerWidth >= 768 ? 128 : 64 }
                      width={ window.innerWidth >= 768 ? 128 : 64 } />
              </div>
              <h1 className='login__brand'>
                  Pro Playlist
              </h1>
              <button className='login__btn' onClick={signIn}>
                  Login with Spotify
              </button>
              <p>
                  Powered by
              </p>
              <div className='login__logo'>
                    <Image src='/Spotify_Logo_RGB_Green.png' layout='fill' />
              </div>
          </div>
        </section>

    )
}

export default Login