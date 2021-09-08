export const stopDupesId = ( state, items ) => {

    let newItems
    if( state.length > 0  ) {
        newItems = items.filter(({ id: id1}) => state.some(({ id: id2} ) => id2 === id1 ))
    } else {
        newItems = items
    }
    const intersection = items.filter(({ id: id1 }) => !newItems.some(({ id: id2 }) => id2 === id1 ) )
    const ogItems = state.filter(({ id: id1 }) => ![ ...newItems, ...intersection ].some(({ id: id2 }) => id2 === id1 ))
    const result = [ ...ogItems,  ...newItems, ...intersection ]

    return result
}

export const stopDupesName = ( state, items ) => {

    let newItems
    if( state.length > 0  ) {
        newItems = items.filter(({ name: name1}) => state.some(({ name: name2 } ) => name2 === name1 ))
    } else {
        newItems = items
    }
    const intersection = items.filter(({ name: name1 }) => !newItems.some(({ name: name2 }) => name2 === name1 ) )
    const ogItems = state.filter(({ name: name1 }) => ![ ...newItems, ...intersection ].some(({ name: name2 }) => name2 === name1 ))
    const result = [ ...ogItems,  ...newItems, ...intersection ]

    return result
}