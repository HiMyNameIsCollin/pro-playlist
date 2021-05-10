
const CategoryCard = ({ item }) => {
    return(
        <div className='categoryCard'>
            <img className='categoryCard__image' src={item.icons[0].url} />
        </div>
    )
}

export default CategoryCard