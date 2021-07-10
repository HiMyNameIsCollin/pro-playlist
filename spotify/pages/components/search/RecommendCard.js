import { useEffect , useState, useContext } from 'react'
import ResultCard from './ResultCard'
import Slider from '../Slider'
import  useApiCall  from '../../hooks/useApiCall'
import { SearchHookContext } from './Search'
import { DbFetchedContext } from '../Dashboard'


const RecommendCard = ({ data }) => {

    const [ appearsOn, setAppearsOn ] = useState([])
    
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const { setActiveSearchItem } = useContext( SearchHookContext )
    const { user_info } = useContext( DbFetchedContext )
    const albumRoute = 'v1/artists'
    
    useEffect(() => {
        if( data.id ) {
            finalizeRoute('get', 
            `${ albumRoute }/${ data.id }/albums`,
            data.id,
            'include_groups=compilation,appears_on',
            'limit=5',
            `market=${ user_info.country }`)
        }
    }, [ data ])

    useEffect(() => {
        if( apiPayload ) setAppearsOn( apiPayload.items )
    }, [ apiPayload ] )

    return(
        <div className='recommendCard'>
            <ResultCard data={ data }/>
            
            <Slider message={`Featuring ${data.name}`} items={ appearsOn } setActiveItem={ setActiveSearchItem }/>
        </div>
    )
}

export default RecommendCard