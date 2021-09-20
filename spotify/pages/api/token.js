export default (req, res) => {
    const TOKENURL = 'https://accounts.spotify.com/api/token'
    fetch(TOKENURL, {
        method: 'post',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded ',
          'Authorization' : 'Basic ' + (Buffer.from(process.env.NEXT_PUBLIC_CLIENT_ID + ':' + process.env.NEXT_PUBLIC_CLIENT_SECRET).toString('base64'))
        },
        body: req.body.tokenBody
      })
    .then( response => response.json())
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json(error, body))
}