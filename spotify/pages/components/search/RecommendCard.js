import { useEffect , useState, useContext } from 'react'
import ResultCard from './ResultCard'
import Slider from '../Slider'
import  useApiCall  from '../../hooks/useApiCall'
import { SearchHookContext } from './Search'
import { ManageHookContext } from '../manage/Manage'
import { DbFetchedContext } from '../Dashboard'


const RecommendCard = ({ setActiveItem, data }) => {

    const [ appearsOn, setAppearsOn ] = useState([])
    
    const albumRoute = 'v1/artists'
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    const searchContext = useContext( SearchHookContext )
    const manageContext = useContext( ManageHookContext )
    const { user_info } = useContext( DbFetchedContext )
    
    
    // const setActiveItem = searchContext ? 
    //                       searchContext.setActiveSearchItem :
    //                       manageContext.setActiveManageItem
    
    
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
            <ResultCard setActiveItem={ setActiveItem } data={ data }/>
            
            <Slider message={`Featuring ${data.name}`} items={ appearsOn } setActiveItem={ setActiveItem }/>
        </div>
    )
}

export default RecommendCard