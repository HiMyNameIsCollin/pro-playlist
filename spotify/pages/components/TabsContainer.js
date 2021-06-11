import Tab from './Tab'

const TabsContainer = ({ items }) => {
    return(
        <section className='tabsContainer'>
            <div className='tabsContainer__title'>
                <h2>
                    Recently played
                </h2>
                <span>
                    More
                </span>
            </div>
            {
                items.map(( item, i ) => {
                   return <Tab item={ item.track } key={ i }/>
                })
            }
        </section>
    )
}

export default TabsContainer