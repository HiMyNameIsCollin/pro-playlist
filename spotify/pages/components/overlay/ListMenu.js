
const ListMenu = ({ data ,func }) => {
    return(
        <div className='popup__listMenu'>
            <h2> { data.text } </h2>
            {
                data.array.map( (a, i) => {
                    return <button onClick={ ()=> func(a)}> <span> { a.name } </span> <i class="fas fa-arrow-right"></i></button>
                })
            }
        </div>
    )
}

export default ListMenu