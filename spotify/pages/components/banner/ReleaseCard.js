import { whichPicture } from '../../../utils/whichPicture'
import { capital } from '../../../utils/capital'
import { useEffect, useContext } from 'react'
import { DbHookContext } from '../Dashboard'

const ReleaseCard = ({ item }) => {

    const { setActiveHomeItem, setActiveManageItem, setDashboardState  } = useContext( DbHookContext )

    const handleMngBtn = (e) => {
        e.stopPropagation()
        setActiveManageItem( item )
        setTimeout( setDashboardState('manage') ,500)
    }

    return(
        <div className='releaseCard' onClick={ () => setActiveHomeItem( item )}>
            <div className='releaseCard__imgContainer'>
                <img src={ whichPicture( item.images, 'med' )} alt='Personald new release' />
            </div>
            <div className='releaseCard__info'>
                <div> 
                    <p>
                        { item.name }
                    </p>

                    <span> { capital( item.type ) } </span> 
                    {
                        item.album_type === 'single' &&
                        <>
                            <i className="fas fa-dot-circle"></i>
                            <span> { capital( item.album_type ) } </span> 
                        </>
                    }
                    
                </div>
                <button onClick={ handleMngBtn } className='openMngBtn' style={{ marginTop: 'auto'}}>
                    Open in manager
                </button> 
            </div>
        </div>
    )
}

export default ReleaseCard 