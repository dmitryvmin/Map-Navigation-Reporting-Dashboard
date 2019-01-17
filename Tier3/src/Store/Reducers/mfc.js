import GGConsts from '../../Constants';

const initState = {
    mfc_updating: false,
    mfc_selected: [],
}

function mfcReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.MFC_UPDATING:
            return {
                ...state,
                mfc_updating: true,
            }

        case GGConsts.MFC_SELECTED:
            return {
                ...state,
                mfc_updating: false,
                mfc_selected: action.mfc_selected,
            }

        default:
            return state;
    }
}

export default mfcReducer;
