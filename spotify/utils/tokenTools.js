
  
export const handleAuthorizationResponse = ( data ) => {
    const now = new Date().getTime()
    if(data.access_token) localStorage.setItem( 'access_token', data.access_token )
    if(data.refresh_token) localStorage.setItem( 'refresh_token', data.refresh_token )
    if(data.expires_in) localStorage.setItem( 'token_expiry', now)
}

export const checkToken = ( token_expiry ) => {
    if(new Date().getTime() - token_expiry > 360000){
      return true
    } else {
      return false
    }
}

export const refreshToken = ( token, func ) => {
    const initRefreshToken = (token) => {
        let body = 'grant_type=refresh_token'
        body += '&client_id=' + process.env.NEXT_PUBLIC_CLIENT_ID
        body += '&refresh_token=' + token
        return body
      }
    const body = initRefreshToken(token)
    func(body)
  }