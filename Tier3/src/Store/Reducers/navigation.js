import GGConsts from '../../Constants';

const initState = {
    nav_tier: false,
    nav_hover: false,
    nav_updating: false,
    navigation: {
        country_selected: 'Nigeria',
        state_selected: 'All',
        lga_selected: false,
        facility_selected: false,
    }
}

function navReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.NAV_TIER:
            return {
                ...state,
                nav_tier: action.nav_tier
            }
        case GGConsts.UPDATE_NAV:
            return {
                ...state,
                nav_updating: true,
            }
        case GGConsts.NAV_HOVER:
            return {
                ...state,
                nav_hover: action.nav_hover,
            }
        case GGConsts.NAVIGATION:
            return {
                ...state,
                nav_updating: false,
                navigation: {
                    ...action.navigation,
                }
            }

        default:
            return state;
    }
}

export default navReducer;
