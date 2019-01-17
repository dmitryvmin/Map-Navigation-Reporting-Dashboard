import GGConsts from '../../Constants';
import {put} from 'redux-saga/effects';

// TODO: build out the fake data here...

const data = [
    {
        "id": "aff33bcb-8afa-4049-84bb-dee058b4186d",
        "manufacturer": "Dometic",
        "model": "TCW40 SDD",
        "location": "8R3F+WX",
        "metrics": {
            "start_time": "2008-09-15T15:53:00+05:00",
            "end_time": "2008-16-15T15:53:00+05:00",
            "alarm_count": 24,
            "alarm_over_seconds": 40002,
            "alarm_under_seconds": 30042,
            "temp_mean": 2.3,
            "uptime_percent": 0.94,
            "unknown_time_percent": 0.42,
            "holdover_mean": 5.12
        },
        "temperature_data_logger": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1f",
            "manufacturer": "Berlinger",
            "model": "Fridgetag 2L",
            "serial": "AAABCE22"
        },
        "facility": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1f",
            "name": "PHC Bauchi",
            "location": "VR53+WM",
            "regions": {
                "0": "Nigeria",
                "1": "Bauchi",
                "2": "Ningi"
            }
        }
    },
    {
        "id": "aff33bcb-8afa-4049-84bb-dee058b41844",
        "manufacturer": "Sundanzer",
        "model": "TCW40 SDD",
        "location": "HJ2P+FG",
        "metrics": {
            "start_time": "2008-09-15T15:53:00+05:00",
            "end_time": "2008-16-15T15:53:00+05:00",
            "alarm_count": 40,
            "alarm_over_seconds": 50002,
            "alarm_under_seconds": 20042,
            "temp_mean": 3.5,
            "uptime_percent": 0.64,
            "unknown_time_percent": 0.62,
            "holdover_mean": 3.12
        },
        "temperature_data_logger": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1g",
            "manufacturer": "Berlinger",
            "model": "Fridgetag 2L",
            "serial": "AAABCE22"
        },
        "facility": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1g",
            "name": "PHC Abia",
            "location": "VR53+WM",
            "regions": {
                "0": "Nigeria",
                "1": "Abia",
                "2": "Bende"
            }
        }
    },
    {
        "id": "aff33bcb-8afa-4049-84bb-dee058b41844",
        "manufacturer": "Sundanzer",
        "model": "TCW40 SDD",
        "location": "V4GQ+FR",
        "metrics": {
            "start_time": "2008-09-15T15:53:00+05:00",
            "end_time": "2008-16-15T15:53:00+05:00",
            "alarm_count": 30,
            "alarm_over_seconds": 50002,
            "alarm_under_seconds": 20042,
            "temp_mean": 3.5,
            "uptime_percent": 0.64,
            "unknown_time_percent": 0.62,
            "holdover_mean": 1
        },
        "temperature_data_logger": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1g",
            "manufacturer": "Berlinger",
            "model": "Fridgetag 2L",
            "serial": "AAABCE22"
        },
        "facility": {
            "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1g",
            "name": "PHC Abia",
            "location": "VR53+WM",
            "regions": {
                "0": "Nigeria",
                "1": "Kwara",
                "2": "Edu"
            }
        }
    }
];

function* loadFake() {

    yield put({type: GGConsts.SENSORS_MAP, data });

}

export default loadFake;