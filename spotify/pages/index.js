import Head from 'next/head'

import Container from './components/Container'
import { BrowserRouter as Router } from 'react-router-dom';

const Index = () => {

  return (
    <div>
      <Head>
        <title>Pro Playlists</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="" /> 
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/font-awesome-line-awesome/css/all.min.css"/>
        
      </Head>
      <Router>
        <Container />    
      </Router>
    </div>
  )
}

export default Index