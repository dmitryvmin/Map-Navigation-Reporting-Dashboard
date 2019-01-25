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

const generateRanArr = (n, min, max) => {
    return _.times(n, _.random.bind(min, max));
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

const getFakeSensors = async (f) => {

    const sensorsArr = [];
    const locationsArr = getLocationsArr(lgasData.features, f);

    await asyncForEach(locationsArr, async (el) => {

        const wait = await timeout(1500); // TODO: FOR GOOGLE'S MAP REQUEST LIMIT!

        const location = `${el.properties['admin0Name']}, ${el.properties['admin1Name']}, ${el.properties['admin2Name']}`;
        const results = await geocodeByAddress(location);
        const coordinates = await getLatLng(_.first(results));
        const OLC = new OpenLocationCode;
        const code = OLC.encode(coordinates.lat, coordinates.lng, 10);

        const saveSensor = () => {

            const sensor = {
                "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                "manufacturer": getRanName(fridgesArr).manufacturer,
                "model": getRanName(fridgesArr).model,
                "location": code,
                "metrics": {
                    "start_time": "2008-09-15T15:53:00+05:00",
                    "end_time": "2008-16-15T15:53:00+05:00",
                    "alarm_count": generateRanArr(60, 0, 10),
                    "alarm_over_seconds": generateRanArr(60, 1000, 10000),
                    "alarm_under_seconds": generateRanArr(60, 1000, 10000),
                    "temp_mean": generateRanArr(60, 0, 10),
                    "uptime_percent": generateRanArr(60, 0, 0.5),
                    "unknown_time_percent": generateRanArr(60, 0.5, 1),
                    "holdover_mean": generateRanArr(60, 0, 10),
                },
                "temperature_data_logger": {
                    "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                    "manufacturer": "Berlinger",
                    "model": "Fridgetag 2L",
                    "serial": Math.floor(Math.random() * 1000000000),
                },
                "facility": {
                    "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
                    "name": `${el.properties['admin2Name']} ${ranStr(3)}`,
                    "location": code,
                    "regions": {
                        "0": el.properties['admin0Name'],
                        "1": el.properties['admin1Name'],
                        "2": el.properties['admin2Name'],
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

    });

    return sensorsArr;
}


function* loadFake() {

    // const data = yield call(getFakeSensors);

    yield put({type: GGConsts.SENSORS_MAP, data: fakeSensors});

}

export default loadFake;
