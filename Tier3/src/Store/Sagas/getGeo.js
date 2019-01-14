import _ from 'lodash';
// import GGConsts from '../../Constants';
// import {fetchData} from './fetch';
import {navigationMap} from './../../Utils';

// for Local
import countriesData from '../../Data/countriesData.json';
import statesData from '../../Data/statesData.json';
import lgasData from '../../Data/lgasData.json';

// for REST
// const countries_endpoint = 'https://restcountries.eu/rest/v2/all';
// const states_endpoint = `${'https://cors-anywhere.herokuapp.com/'}https://countryrestapi.herokuapp.com`; // got Nigeria only
// const lgas_endpoint = `http://locationsng-api.herokuapp.com/api/v1/states`;

// For fetching live data from an endpoint
function getGeo(type, selected = null) {

    switch (type) {
        case 'country_selected': {

            // For REST
            // return yield getMapData(GGConsts.COUNTRIES_MAP, countries_endpoint, 'data');

            let data = getGeoJson(countriesData);
            data = addAllOption(type, data);
            return data;
        }
        case 'state_selected': {

            // For REST
            // const contryCode = getCode(selected);
            //
            // if (!contryCode) {
            //     console.warn(`@@ Couldn't fetch states for ${selected}`);
            //     return;
            // }
            // const formattedCode = contryCode.toLowerCase();
            // const uri = `${states_endpoint}/${formattedCode}`;
            // return yield getMapData(GGConsts.STATES_MAP, uri, 'data.states');

            let data = getGeoJson(statesData);
            data = addAllOption(type, data);
            return data;
        }
        case 'lga_selected': {

            // For REST
            // const { country_selected } = yield select(navSelector);
            // if (country_selected === 'Nigeria') {
            //     let stateFormatted = selected.replace(/\State+[.!?]?$/, '').trim().toLowerCase();
            //     let uri = `${lgas_endpoint}/${stateFormatted}/details`;
            //     return yield getMapData(GGConsts.LGAS_MAP, uri, 'data.lgas');
            // }

            let data = getGeoJson(lgasData);
            data = addAllOption(type, data);
            return data;
        }
        case 'facility_selected': {
            return ['All', 'facility A', 'facility B', 'facility C'];
        }
        default: {
            return null;
        }
    }
}

const getGeoJson = (file) => {
    // Make a copy of the file
    const geo = [
        ...file.features.slice()
    ];

    return geo;
}

/**
 * Standardize country geo-json data, which labels it's country name differently from state and lga data
 * @param { array } data - geo-json data
 * @return { array } geo-json data
 */
const formatCoutryGJ = (data) => {
    const f = [];
    data.forEach(d => {
        const n = d.properties.name;
        d.properties['admin0Name'] = n;
        f.push(d);
    });

    return f;
}

/**
 * Add an 'All' option to the hash for the drop-down
 * @param { string } type - type of location being handled
 * @param { array } data - geo-json data
 * @return { array } geo-json data
 */
const addAllOption = (type, data) => {
    // const copy = _.clone(data);
    let d = data;
    if (type === 'country_selected') {
        d = formatCoutryGJ(data);
    }
    const code = _.first(navigationMap.filter(f => f.type === type)).code;
    d.unshift({properties: {[code]: 'All'}});

    return d;
}

// const formatCountryMap = arr => {
//     return arr.reduce((acc, cur) => {
//         acc.push(cur.name);
//         return acc;
//     }, []);
// }

// return Map to the store
// function* getMapData(type, resource, key) {
//     const response = yield fetchData(resource);
//     let data = _.get(response, key);

//     if (data) {
//         // remove if data is saved locally instead of fetched from the API
//         if (type === GGConsts.COUNTRIES_MAP) data = formatCountryMap(data);
//         // sort alphabetically
//         data.sort();
//         // add an `all` option
//         addAllOption(data);
//         return data;

//     } else {
//         console.warn(`Unable to update ${type}. No ${key} in the response from ${resource}: ${JSON.stringify(response)}`);
//     }
// }

export default getGeo;
