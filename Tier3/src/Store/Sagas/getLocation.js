import _ from 'lodash';

/**
 * Get the location selected in the navigation
 * @returns {string} location - Concatenated tiers
 */
function getLocation(navigation) {
    // const navState = yield select(getNavState);

    const {
        country_selected,
        state_selected,
        lga_selected
    } = navigation;

    const nav = [country_selected, state_selected, lga_selected];
    const activeNavs = [];

    nav &&_.forEach(nav, t => {
        // only looking for specific location names in the nav tier
        if (t && t !== 'All') {
            activeNavs.push(t);
        }
        // break out of the loop since subsequent locations can't exist
        else {
            return false;
        }
    });

    const location = activeNavs.join(', ');
    console.log(`%c selected location: ${location}`, 'background: #51326c; color: white; display: block;');

    return location;
}

export default getLocation;