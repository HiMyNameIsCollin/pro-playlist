
const ListMenu = ({ data ,func, func2 }) => {
    return(
        <div className='popup__listMenu'>
            <h4> { data.text } </h4>
            {
                data.array.map( (a, i) => {
                    return <button onClick={ ()=> func(a)}> <span> { a.name } </span> <i class="fas fa-arrow-right"></i></button>
                })
            }
        </div>
    )
}

export default ListMenu