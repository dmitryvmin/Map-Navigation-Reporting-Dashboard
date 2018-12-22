import _ from 'lodash';
import cc from 'country-code';
import countriesData from '../Data/countriesData.json';
import statesData from '../Data/statesData.json';
import lgasData from '../Data/lgasData.json';

export const formatLabel = loc => {
    let label = loc.split('_');
    label.splice(-1, 1);
    label = label.join(' ');
    return label;
}

export const getCountryObjByName = (data, name) => {
    return _.first(data.filter(country => country.name === name));
}

// getFilterKey and getChildFilterKey are for working mapbox shapefiles
export const getFilterKey = type => {
    switch (type) {
        case 'country_selected':
            return 'ADM0_A3';
        case 'state_selected':
            return 'gn_name';
        case 'lga_selected':
            return 'admin2Name';
    }
}
export const getChildFilterKey = type => {
    switch (type) {
        case 'country_selected':
            return 'adm0_a3';
        case 'state_selected':
            return 'admin1Name';
        case 'lga_selected':
            return 'admin2Name';
    }
}

export const getCountryName = code => {
    const c = cc.find({alpha3: code});
    const name = c.name;
    return name;
}

export const getCountryCode = country => {
    const c = cc.find({name: country});
    const code = c.alpha3;
    return code;
}

// TODO: this function will eventually move into a Data Processing Saga
// so we can synchronously derive the data state from the selected  metric/filter/time params
export const getData = (tier, navigation) => {

    const curNM = getNMap(tier, 'tier'); // current navigation map
    const childNM = getNMapChild(tier, 'tier'); // child navigation map

    if (childNM.type === 'facility_selected') {
        return null;
    }

    let data = getGeoJson(childNM.type);

    if (curNM.type !== 'All') {
        data = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
    }

    data = data.reduce((acc, cur) => {
        let name = cur.properties[childNM.code];
        acc.push({
            [childNM.map]: name,
            ['alarms']: 0,
        });
        return acc;
    }, []);

    return data;
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


export const geoJsonDataMap = {
    'country_selected': countriesData,
    'state_selected': statesData,
    'lga_selected': lgasData,
};

export const getGeoJson = (type) => {
    let data = geoJsonDataMap[type].features;
    return data;
}