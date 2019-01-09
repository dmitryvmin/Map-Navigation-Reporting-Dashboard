import _ from 'lodash';
import {
    select
} from 'redux-saga/effects';

import {
    sensorsSelector,
    navSelector,
    tierSelector,
    metricSelector
} from './../Selectors';

import {
    getNMap,
    getNMapChild,
    getGeoJson,
} from './../../Utils';

// const fridges = [
//     { 
//       "manufacturer": "Dulas",
//       "models": [
//         "VC150 SDD"
//       ]
//     },
//     { 
//       "manufacturer": "Dometic",
//       "models": [
//         "TCW40 SDD",
//         "TCW2000 SDD"
//       ]
//     },
//     { 
//       "manufacturer": "Sun Frost",
//       "models": [
//         "917667"
//       ]
//     }, 
//     {
//       "manufacturer": "Sundanzer",
//       "models": [
//         "13930007"
//       ]
//     }
// ];

const getRandomFridge = () => {
    const x = _.random(0, 100);
    switch (true) {
        case (x < 30):
            return {manufacturer: "Dulas", model: "VC150 SDD"};
        case (x < 60):
            return {manufacturer: "Dometic", model: "TCW40 SDD"};
        case (x < 90):
            return {manufacturer: "Dometic", model: "TCW2000 SDD"};
        case (x < 95):
            return {manufacturer: "Sun Frost", model: "917667"};
        case (x  < 100):
            return {manufacturer: "Sundanzer", model: "13930007"}
        default:
            return {manufacturer: "Dometic", model: "TCW40 SDD"};
    }
}

// import alarmsData from '../../Data/alarms.json';

/**
 *  Saga responsible for formatting data for the Map / Table views
 *  @param { object } dataParam - if a dataParam is provided we can assume other params haven't changed
*/
function* composeDisplayData( dataParam ) {

    // The clean data is saved in the SENSORS_MAP (dataReducer)
    const sensors = yield select(sensorsSelector);

    // DataParams that effects how the state should be transformed:
    // 1. Location
    const navigation = yield select(navSelector);
    const tier = yield select(tierSelector);

    // 2. Metric
    const metric = yield select(metricSelector);

    // 3. Filter - Device Type
    // 4. Filter - Device Manufacturer
    // 5. Timeframe

    if (!sensors || !navigation || !tier || !metric) {
        return;
    }

    const curNM = getNMap(tier, 'tier'); // current navigation map
    const childNM = getNMapChild(tier, 'tier'); // child navigation map

    let rows;

    // Temporary
    if (childNM.type === 'facility_selected') {

        // TODO: this is random data..
        rows = [

            {
                geometry: {type: "MultiPolygon", coordinates: Array(1)},
                properties: {
                    admin1Name: "Abia",
                    admin1Pcod: "NG001",
                    admin1RefN: "Abia",
                    admin1AltN: null,
                    admin1Al_1: null
                },
                type: "Feature"
            },
            {
                geometry: {type: "MultiPolygon", coordinates: Array(1)},
                properties: {
                    admin1Name: "Abia",
                    admin1Pcod: "NG001",
                    admin1RefN: "Abia",
                    admin1AltN: null,
                    admin1Al_1: null
                },
                type: "Feature"
            }
        ]

    } else {

        // ### Rows
        let data = getGeoJson(childNM.type);

        if (curNM.type !== 'All') {
            rows = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
        }
    }

    // ### Columns
    let columns = [];

    const getColumn = (id) => {
        return {
            id,
            numeric: false,
            disablePadding: false,
            label: id,
        }
    };

    columns.push(getColumn(metric));
    columns.push(getColumn(childNM.map));
    columns.push(getColumn('Manufacturers'));

    if (tier === 'COUNTRY_LEVEL') {
        columns.push(getColumn('Country Data'));
    }
    if (tier === 'STATE_LEVEL') {
        columns.push(getColumn('State Data'));
    }
    if (tier === 'LGA_LEVEL') {
        columns.push(getColumn('LGA Data'));
    }

    // ### Cells
    // TODO: Data sorting/filtering by DataParams will happen here...

/* basis of data structure...  use this format and generate a realistic random bunch of data so system more ready for real data...
{
    "fridges": [
    {
      "id": "aff33bcb-8afa-4049-84bb-dee058b4186d"
      "manufacturer": "Dometic",
      "model": "TCW40 SDD",
      "location": "VR53+WMX",
      "metrics": {
        "start_time": "2008-09-15T15:53:00+05:00",
        "end_time": "2008-16-15T15:53:00+05:00",
        "alarm_count": 24,
        "alarm_median_day": 2, 
        "alarm_over_seconds": 40002,
        "alarm_under_seconds": 30042,
        "temp_min": 1.4,
        "temp_mean": 2.3,
        "temp_max": 11,
        "uptime_percent": 0.94,
        "unknown_time_percent": 0.42,
        "holdover_min": 2,
        "holdover_mean": 5.12,
        "holdover_max": 7.3
      },
      "temperature_data_logger": {
        "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1f"
        "manufacturer": "Berlinger",
        "model": "Fridgetag 2L",
        "serial": "AAABCE22"
      },
      "facility": {
        "id": "aa04ff56-085d-4c97-9a07-39d31d4d0d1f"
        "name": "PHC Bauchi",
        "country": "Nigeria",
        "location": "VR53+WM"
        "regions": {
          "0": "Bauchi",
          "1": "Ningi"
        }
      }
    }
    ]
  }
  */


    let cells = rows.reduce((acc, cur) => {
        let name = cur.properties[childNM.code];
        const fridge = getRandomFridge();
        acc.push({
            [childNM.map]: name,
            // For testing:
            'Alarms': _.random(0, 30), // original Random data :)
            'Holdover': _.random(0, 10), // original Random data :)
            'chart': Math.random() >= 0.7, // original Random boolean
            // start of new Random but more real data (structure wise)
            // these cells don't respect this structure.  Will maybe have to create this 'random' data separately 
            // and amalgamate it here in a proper method.
            "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
            "manufacturer": fridge.manufacturer,
            "model": fridge.model,
            "location": "VR53+WMX",  // still have to get this ? not sure what exactly this references
            "metrics": {
                "start_time": "2008-09-15T15:53:00+05:00",
                "end_time": "2008-16-15T15:53:00+05:00",
                "alarm_count": 24,
                "alarm_median_day": 2, 
                "alarm_over_seconds": 40002,
                "alarm_under_seconds": 30042,
                "temp_min": 1.4,
                "temp_mean": 2.3,
                "temp_max": 11,
                "uptime_percent": 0.94,
                "unknown_time_percent": 0.42,
                "holdover_min": 2,
                "holdover_mean": 5.12,
                "holdover_max": 7.3
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
                "country": "Nigeria",
                "location": "VR53+WM",   // still have to get this ? not sure what exactly this references
                "regions": {
                  "0": "Bauchi",
                  "1": "Ningi"
                }
              }
        });
        return acc;
    }, []);

    return {columns, rows, cells};

}

export default composeDisplayData;