import _ from 'lodash';
import cc from 'country-code';
import countriesData from './../Map/countriesData.json';
import statesData from './../Map/statesData.json';
import lgasData from './../Map/lgasData.json';

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

    const curNM = getNMap(tier); // current navigation map
    const childNM = getNMapChild(tier); // child navigation map

    // If no child data - so if facility level
    if (!childNM.data) {
        return null;
    }

    let data = childNM.data.features;

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
 * @param {string || number} - take in any of keys that a navigationMap object has
 * @returns {Object} return a child navigationMap object
 */
export const getNMapChild = (value) => {
    for (let n of navigationMap) {
        for (let v of Object.values(n)) {
            if (v === value) {
                return getNMap(n.index + 1);
            }
        }
        ;
    }
    ;
}

export const getNMapParent = (value) => {
    for (let n of navigationMap) {
        for (let v of Object.values(n)) {
            if (v === value) {
                return getNMap(n.index - 1);
            }
        }
        ;
    }
    ;
}

export const getNMap = (value) => {
    for (let n of navigationMap) {
        for (let v of Object.values(n)) {
            if (v === value) {
                return n;
            }
        }
        ;
    }
    ;
}

export const getNMapByTier = (tier) => {
    return _.first(navigationMap.filter(f => f.tier === tier));
}

export const getNMapByIndex = (index) => {
    return _.first(navigationMap.filter(f => f.index === index));
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
        data: countriesData,
    },
    {
        index: 1,
        type: 'state_selected',
        map: 'states',
        tier: "STATE_LEVEL",
        code: 'admin1Name',
        data: statesData,
    },
    {
        index: 2,
        type: 'lga_selected',
        map: 'lgas',
        tier: "LGA_LEVEL",
        code: 'admin2Name',
        data: lgasData,
    },
    {
        index: 3,
        type: 'facility_selected',
        map: 'facilities',
        tier: "FACILITY_LEVEL",
    }
];
