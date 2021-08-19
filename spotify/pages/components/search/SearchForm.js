import { useRef, useEffect } from 'react'

const SearchForm = ({ searchInput, setSearchInput, autoFocus }) => {

    const searchBarRef = useRef()

    useEffect(() => {
        if( autoFocus ) searchBarRef.current.select()

    }, [])

    const handleSearchInput = ( e ) => {
        setSearchInput( e.target.value )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        searchBarRef.current.blur()
    }

    return(
        <form onSubmit={ handleSubmit } className='searchOverlay__form'>
            <i className="fas fa-search"></i>
            <input 
            ref={ searchBarRef } 
            onClick={ (e) => e.target.select() } 
            onChange={ handleSearchInput } 
            type='text' 
            value={ searchInput }
            name='searchInput'/>
        </form>
    )
}

export default SearchForm 