import _ from 'lodash';
import cc from 'country-code';
import countriesData from './../Map/countriesData.json';
import statesData from './../Map/statesData.json';
import lgasData from './../Map/lgasData.json';

export const formatLabel = loc => {
    let label = loc.split('_');
    label.splice(-1,1);
    label = label.join(' ');
    return label;
}

export const getCountryObjByName = (data, name) => {
    return _.first(data.filter(country => country.name === name));
}

// getFilterKey and getChildFilterKey are for working mapbox shapefiles
export const getFilterKey = type => {
    switch(type) {
        case 'country_selected':
            return 'ADM0_A3';
        case 'state_selected':
            return 'gn_name';
        case 'lga_selected':
            return 'admin2Name';
    }
}
export const getChildFilterKey = type => {
    switch(type) {
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

// TODO: maybe make a getter utility
export const navigationMap = [
    {
        index: -1,
        type: 'world_selected',
        // map: 'countries',
        tier: "WORLD_LEVEL",
        // code: 'admin0Name',
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
