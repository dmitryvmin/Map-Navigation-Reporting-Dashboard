import GGConsts from '../../Constants';
import _ from 'lodash';
import {put, call} from 'redux-saga/effects';
import lgasData from '../../Data/lgasData.json';
import fakeSensors from './../../Data/fakeSensors.json';
import {asyncForEach} from '../../Utils';
import {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import {OpenLocationCode} from 'open-location-code';

const ranBool = () => {
    return Math.random() >= 0.5;
}

const generateRanArr = (n, min, max) => {
    return _.times(n, _.random.bind(min, max));
}

const generateRanArrNull = (size, range) => {
    const numbers = Array.from(Array(range).keys());
    const alarmValues = [null, ...numbers];

    const arr = _.times(size, () => {
        let i = _.random(0, range);
        let val = alarmValues[i];
        return val;
    });

    return arr;
}

const generateRanAlarms = (size, range) => {
    const ran = _.random(0,2);

    if (ran === 0) {
        return generateRanArrNull(size, range);
    }
    else if (ran === 1) {
        return Array(size).fill(0);
    }
    else if (ran === 2) {
        return Array(size).fill(null);
    }
}

const fridgesArr = [
    {manufacturer: "Dulas", model: "VC150 SDD"},
    {manufacturer: "Dometic", model: "TCW40 SDD"},
    {manufacturer: "Dometic", model: "TCW2000 SDD"},
    {manufacturer: "Sun Frost", model: "917667"},
    {manufacturer: "Sundanzer", model: "13930007"},
    {manufacturer: "Dometic", model: "TCW40 SDD"},
]

function getRanName(names) {
    return names[Math.floor(Math.random() * (names.length -1))];
}

const getLocationsArr = (arr, fraction = 1) => {
    const cutoff = Math.ceil(arr.length / fraction);
    const part = arr.slice(0, cutoff);

    return part;
}

const ranStr = (string_length) => {
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadFakeSensors = async (f) => {

    const sensorsArr = [];
    const locationsArr = getLocationsArr(lgasData.features, 1);

    await asyncForEach(locationsArr, async (el) => {

        const wait = await timeout(5000); // TODO: FOR GOOGLE'S MAP REQUEST LIMIT!

        if (el.properties['admin1Name'] !== 'Bauchi') {
            const location = `${el.properties['admin0Name']}, ${el.properties['admin1Name']}, ${el.properties['admin2Name']}`;
            const results = await geocodeByAddress(location);
            const coordinates = await getLatLng(_.first(results));
            const OLC = new OpenLocationCode;
            const code = OLC.encode(coordinates.lat, coordinates.lng, 10);

            const facilityName = `${el.properties['admin2Name']} ${ranStr(3)}`;

            const saveSensor = () => {

                const sensor = {
                    "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                    "manufacturer": getRanName(fridgesArr).manufacturer,
                    "model": getRanName(fridgesArr).model,
                    "location": code,
                    "metric": {
                        "start_time": "2008-09-15T15:53:00+05:00",
                        "end_time": "2008-16-15T15:53:00+05:00",
                        "alarm-count": generateRanAlarms(60, 2),
                        "alarm_over_seconds": generateRanArrNull(60, 10000),
                        "alarm_under_seconds": generateRanArrNull(60, 10000),
                        "temperature-mean": generateRanArrNull(60, 0, 11),
                        "uptime-percent": generateRanArr(60, 2),
                        "unknown-time-percent": generateRanArr(60, 2),
                        "holdover-mean": generateRanArr(60, 5),
                    },
                    "temperature_data_logger": {
                        "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                        "manufacturer": "Berlinger",
                        "model": "Fridgetag 2L",
                        "serial": Math.floor(Math.random() * 1000000000),
                    },
                    "facility": {
                        "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                        "name": facilityName,
                        "location": code,
                        "regions": {
                            "tier0": el.properties['admin0Name'],
                            "tier1": el.properties['admin1Name'],
                            "tier2": el.properties['admin2Name'],
                        }
                    }
                }

                sensorsArr.push(sensor);
            }

            saveSensor();

            const random = Math.random() >= 0.5;
            if (random) {
                saveSensor();
            }

            // // TODO: remove. for debugging.
            console.log('@@SENSOR', sensorsArr);
            window.sensors = sensorsArr;
        }
    });

    return sensorsArr;
}

export default loadFakeSensors;
