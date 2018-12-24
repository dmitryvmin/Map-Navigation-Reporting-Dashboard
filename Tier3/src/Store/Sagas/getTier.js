import {getNMapParent} from './../../Utils';
// TODO: this is not a Saga, move to Utils

const getTier = (map, value) => {
    if (value !== 'All') {
        // If a specific geographic location is selected, the Tier is of that location type, e.g. location: WA, tier: State Level
        let nav_tier = map.tier;
        return nav_tier;

    } else {
        // If location is 'all', the Tier is of the parent type, e.g. state: all, tier: Country Level
        let parent = getNMapParent(map);
        let nav_tier = parent.tier;
        return nav_tier;
    }
}

export default getTier;
