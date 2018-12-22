import GGConsts from '../../Constants';

const initState = {
    display_data: {
        columns: [],
        rows: [],
        cells: [],
    },
}

function displayReducer(state = initState, action) {
    switch (action.type) {

        case GGConsts.DISPLAY_DATA:
            return {
                ...state,
                display_data: action.display_data
            }

        default:
            return state;
    }
}

export default displayReducer;
