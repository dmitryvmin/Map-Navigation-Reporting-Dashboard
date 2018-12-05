import _ from 'lodash';

export const getCountryObjByName = (data, name) => {
    return _.first(data.filter(country => country.name === name));
}