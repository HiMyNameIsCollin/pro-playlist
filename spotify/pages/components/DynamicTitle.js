import { whichPicture } from '../../utils/whichPicture'
import useApiCall from '../hooks/useApiCall'
import { useState , useEffect } from 'react'

const DynamicTitle = ({ message, item }) => {

    const [ image, setImage ] = useState( undefined )
    const { finalizeRoute, apiPayload } = useApiCall()

    useEffect(() => {
        const api = 'https://api.spotify.com/'
        finalizeRoute('get', item.item.href.substring( api.length ) )
    }, [])

    useEffect(() => {
        if( apiPayload ) setImage( whichPicture( apiPayload.images, 'med' ) )
    },[ apiPayload ])

    return( 
        <div className='dynamicTitle'>
            <div className='dynamicTitle__imgContainer' >
            {
                image &&
                <img src={ image } alt='Personalized new release' />
            }
            </div>
            <div className='dynamicTitle__info'>
                <p className='dynamicTitle__desc'> { message } </p>
                <p className='dynamicTitle__title'> { item.artist.name } </p>
            </div>
        </div>
    )
}

export default DynamicTitle