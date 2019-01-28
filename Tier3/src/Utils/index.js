// import GGConsts from '../Constants';
import _ from 'lodash';
import countriesData from '../Data/countriesData.json';
import statesData from '../Data/statesData.json';
import lgasData from '../Data/lgasData.json';

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export const formatLabel = loc => {
    let label = loc.split('_');
    label.splice(-1, 1);
    label = label.join(' ');
    return label;
}

/**
 * Returns a child map (next down the nav hierarchy, index + 1)
 * @param {string | number} value - value to search by. any of the values that the navigationMap object has.
 * @param {object | string} identifier - value type to help limit the search. If none provided, assuming the first arg is a map object
 * @returns {Object} return a child navigationMap object
 */
const getNMSibling = (value, id = false, sibling) => {
    let map;

    if (id) {
        for (let n of navigationMap) {
            for (let v of Object.values(n)) {
                if (v === value) {
                    map = getNMap(n.index + sibling);
                }
            }
        }
    } else {
        let childIx = value.index + sibling;
        map = getNMap(childIx, 'index');
    }

    // console.log(`%c Utils NM for ${value}: ${JSON.stringify(map)}`, 'background: #ffc107; color: white; display: block;');
    return map;

}

export const getLocName = (navigation, tier) => {
    const NM = getNMap(tier, 'tier');
    const locName = navigation[NM.type];
    return locName;
}

export const getNMapChild = (value, id) => {
    let sibling = 1;
    let siblingMap = getNMSibling(value, id, sibling);
    return siblingMap;
}

export const getNMapParent = (value, id) => {
    let sibling = -1;
    let siblingMap = getNMSibling(value, id, sibling);
    return siblingMap;
}

export const getNMap = (value, type = null) => {
    if (!type) {
        for (let n of navigationMap) {
            for (let v of Object.values(n)) {
                if (v === value) {
                    return n;
                }
            }
        }
    } else {
        let map = _.first(navigationMap.filter(n => n[type] === value));
        return map;
    }
}

// TODO: replace strings with constants
export const navigationMap = [
    {
        index: -1,
        type: 'world_selected',
        tier: "WORLD_LEVEL",
    },
    {
        index: 0,
        type: 'country_selected',
        map: 'countries',
        tier: "COUNTRY_LEVEL",
        code: 'admin0Name',
    },
    {
        index: 1,
        type: 'state_selected',
        map: 'states',
        tier: "STATE_LEVEL",
        code: 'admin1Name',
    },
    {
        index: 2,
        type: 'lga_selected',
        map: 'lgas',
        tier: "LGA_LEVEL",
        code: 'admin2Name',
    },
    {
        index: 3,
        type: 'facility_selected',
        map: 'facilities',
        tier: "FACILITY_LEVEL",
    }
];

// export navMap = {}

export const geoJsonDataMap = {
    'country_selected': countriesData,
    'state_selected': statesData,
    'lga_selected': lgasData,
};

export const getGeoJson = (type) => {
    if (!geoJsonDataMap[type]) {
        return;
    }
    let data = geoJsonDataMap[type].features;
    return data;
}

export const chunkArray = (arr, size) => {
    let index = 0;
    let arrayLength = arr.length;
    let tempArray = [];

    for (index = 0; index < arrayLength; index += size) {
        let chunk = arr.slice(index, index + size);
        tempArray.push(chunk);
    }

    return tempArray;
}