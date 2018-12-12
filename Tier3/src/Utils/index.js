import _ from 'lodash';

export const getCountryObjByName = (data, name) => {
    return _.first(data.filter(country => country.name === name));
}

// TODO: make a getter utility
export const navigationMap = [
    {
        index: 0,
        type: 'country_selected',
        map: 'countries',
        tier: "COUNTRY_LEVEL",
    },
    {
        index: 1,
        type: 'state_selected',
        map: 'states',
        tier: "STATE_LEVEL",
    },
    {
        index: 2,
        type: 'lga_selected',
        map: 'lgas',
        tier: "LGA_LEVEL",
    },
    {
        index: 3,
        type: 'facility_selected',
        map: 'facilities',
        tier: "FACILITY_LEVEL",
    }
];

const getFromNavMap = (getter, returnType) => {
    const n = navigationMap[getter];
    const r = n[returnType];
    return r;
}