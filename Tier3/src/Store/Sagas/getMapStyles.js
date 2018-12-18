import _ from 'lodash';
import { navigationMap } from './../../Utils';
import { getMapStyle, getFilter, getChildFilter, applyLayerFilter } from './../../Map/map-style.js';

/**
 * Update Map styles
 * @returns {string} location - Concatenated tiers
 */
const updateMapStyle = (tier, navigation) => {

    const navMap = _.first(navigationMap.filter(n => n.tier === tier));
    const navValue = navigation[navMap.type];

    // 1. Get a copy of the map style
    let map_style = getMapStyle();

    // 4. Shade inner layer
    // NOTE: there's no map for facility level
    if (navMap.type !== 'lga_selected') {
        const childTier = _.first(navigationMap.filter(n => n.index === navMap.index + 1)) || null;
        const t = childTier.type;
        const f = getChildFilter('include', t, navValue);

        map_style = applyLayerFilter(map_style, t, f);
    }

    // 3. Shade current layer
    const filter = getFilter('exclude', navMap.type, navValue);
    map_style = applyLayerFilter(map_style, navMap.type, filter);


    // 2. First shade the parent regions
    const parentTiers = navigationMap.filter(n => n.index < navMap.index);
    if (parentTiers.length) {
        _.reverse(parentTiers).forEach(n => {
            let type = n.type;
            let value = navigation[type];
            let filter = getFilter('exclude', type, value);
            map_style = applyLayerFilter(map_style, type, filter);
        });
    }

    return map_style;
}

export default updateMapStyle;
