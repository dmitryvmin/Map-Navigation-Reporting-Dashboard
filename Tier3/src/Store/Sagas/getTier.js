import _ from 'lodash';
import { navigationMap } from './../../Utils';

 const getTier = (map, value) => {
    let tier;

    if (value !== 'All') {
        // If a specific geographic location is selected, the Tier is of that location type, e.g. location: WA, tier: State Level
        tier = _.get(_.first(navigationMap.filter(f => f.type === map.type)), 'tier');
        return tier;

    } else {
        // If location is 'all', the Tier is of the parent type, e.g. state: all, tier: Country Level
        const parent = _.first(navigationMap.filter(nav => nav.index === map.index - 1));
        tier = parent.tier;
        // const navTier = _.get(_.first(navigationMap.filter(f => f.type === map.type)), 'tier');

        return tier;
    }
}

export default getTier;
