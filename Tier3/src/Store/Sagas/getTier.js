import {getNMapParent} from './../../Utils';
// TODO: this is not a Saga, move to Utils

const getTier = (map, value) => {
    if (value !== 'All') {
        // If a specific geographic location is selected, the Tier is of that location type, e.g. location: WA, tier: State Level
        let tier = map.tier;
        return tier;

    } else {
        // If location is 'all', the Tier is of the parent type, e.g. state: all, tier: Country Level
        let parent = getNMapParent(map);
        let tier = parent.tier;
        return tier;
    }
}

export default getTier;
