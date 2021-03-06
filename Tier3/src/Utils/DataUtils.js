import GGConsts from '../Constants';
import _ from 'lodash';

export const applyTimeframe = (sensors, timeframe, metricKey) => {
    // TODO: how does `All` work for the timeframe?
    // needs to be a constrained number of days that
    // can be applied across the data set - 360 days?

    if (timeframe === 'All') {
        return sensors;
    }

    const days = timeframe.match(/\d+/)[0];

    const sensorsSegment = sensors.reduce((a, c) => {

        if (!c.metric) {
            return a;
        }

        _.get(c, metricKey).splice(days);
        a.push(c);

        return a;

    }, []);

    return sensorsSegment;
}

function getProperName(name) {
    if (!name) {
        return;
    }
    name = name.toLowerCase();
    if (name === "bauchi state") {
        name = "bauchi"
    } else if (name === "jama&#39;are") {
        name = "jama'are"
    } else if (name === "jamaare") {
        name = "jama'are"
    } else if (name === "t/balewa") {
        name = "Tafawa Balewa"
    } else if (name === "tafawa-balewa") {
        name = "Tafawa Balewa"
    } else if (name === "balewa") {
        name = "Tafawa Balewa"
    } else if (name === "bashe / ningi lga") {
        name = "ningi";
    } else if (name === "burra / ningi lga") {
        name = "ningi";
    } else if (name === "kurmi / ningi lga") {
        name = "ningi";
    } else if (name === "itas-gadau") {
        name = "Itas/Gadau";
    } else if (name === "itas gadau") {
        name = "Itas/Gadau"
    } else if (name === "kirfi lga") {
        name = "kirfi"
    } else if (name === "dass lga") {
        name = "dass"
    } else if (name === "dambam") {
        name = "damban"
    } else if (name === "dagauda") {
        name = "damban"
    }
    return(toTitleCase(name));
}

export const getMetricFinal = (data, totalDevices, metricType) => {
    let finalVal;

    if (metricType === 'Alarms') {
        finalVal = _.isArray(data) ? _.sum(data) : data;
    }
    else if (metricType === 'Holdover') {
        finalVal = _.isArray(data) ? _.mean(data) : data;
    }
    else if (metricType === 'Uptime') {
        finalVal = _.isArray(data) ? _.sum(data) : data;
    }
    else if (metricType === 'Reporting') {
        finalVal = _.isArray(data) ? _.sum(data) : data;
    }
    else {
        console.log(`%c trouble calculating final ${metricType} value from ${data}`, GGConsts.CONSOLE_ERROR);
    }

    return finalVal;
}

export const getMetricKey = (metric) => {
    if (metric === 'Alarms') {
        return 'metric.alarm-count';
    }
    else if (metric === 'Holdover') {
        return 'metric.holdover-mean';
    }
    else if (metric === 'Uptime') {
        return 'metric.uptime-percent';
    }
    else if (metric === 'Reporting') {
        return 'metric.unknown-time-percent';
    }
    else {
        console.log(`%c unknown metric passed when getting the metric key for composeDisplayData: ${metric}`, GGConsts.CONSOLE_ERROR);
    }
}

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

export const filterSensorsByLoc = (sensors, index, location) => {
    const filtered = sensors.filter(f => {
        const geoLocation = getProperName(f.facility.regions[`tier${index}`]);
        const match = geoLocation === location;
        return match;
    });
    return filtered;
}
export const filterSensorsByFacility = (sensors, facility) => {
    const filtered = sensors.filter(f => f.facility.name === facility);
    return filtered;
}

export const filterSensorsByMfc = (sensors, mfc) => {
    const filtered = sensors.filter(f => mfc.includes(f.manufacturer));
    return filtered;
}

export const getTotalByFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        let t = _.get(c, metric);

        // skip over if sensor doesn't have a metric value
        if (!t) {
            console.log(`% device doesn't contain any metrics - ${metric}`, GGConsts.CONSOLE_WARN);
            return a;
        }

        if (_.isArray(t)) {
            t = t.reduce((a, b) => a + b, 0);
        }

        a.push(t);
        return a;

    }, []);

    const total = reduced.reduce((a, b) => a + b, 0);

    return total;
}

export const getRedbyFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        let val = _.get(c, metric);

        if (!val) {
            return a;
        }

        if (_.isArray(val)) {
            let red = val.filter(f => f > 0);
            let nullsTotal = red.reduce((a, b) => a + b, 0);
            a.push(nullsTotal);
            return a;
        }
        else {
            return a;
        }
    }, []);

    const total = reduced.reduce((a, b) => a + b, 0);

    return total;
}

export const getMetricsPie = (sensors, metric) => {
    const pie = {
        red: 0,
        orange: 1,
        green: 0,
    }

    if (metric === 'Alarms') {
        const key = 'metric.alarm-count';

        sensors.forEach(s => {
            const vals = _.get(s, key);

            if (!vals) {
                return;
            }

            if (vals.includes(1)) {
                pie.red++;
            }
            if (!vals.includes(1) && !vals.includes(null)) {
                pie.green++;
            }
            if (!vals.includes(1) && !vals.includes(0)) {
                pie.orange++;
            }

        })

    }

    // else {}

    return pie;
}

export const getNullsByFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        let val = _.get(c, metric);

        if (!val) {
            return a;
        }

        if (_.isArray(val)) {
            let nulls = val.filter(f => _.isNull(f));
            let nullsTotal = nulls.reduce((a, b) => a + b, 0);
            a.push(nullsTotal);
            return a;
        }
        else {
            return a;
        }
    }, []);

    const total = reduced.reduce((a, b) => a + b, 0);

    return total;
}

export const getMeanByFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        let val = _.get(c, metric);

        if (!val) {
            return a;
        }

        if (_.isArray(val)) {
            val = _.mean(val).toFixed(2);
        }

        let float = parseFloat(val);
        a.push(float);

        return a;

    }, []);

    const mean = parseFloat(_.mean(reduced).toFixed(2));

    return mean;
}

export const reduceSensorsByFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        let val = _.get(c, metric);
        if (_.isArray(val)) {
            val = _.round(_.mean(val));
        }
        a.push(val);
        return a;
    }, []);

    const unique = _.uniqBy(reduced);

    return unique;
}

export const makeColumn = (id) => {
    return {
        id,
        numeric: false,
        disablePadding: false,
        label: id,
    }
};

export const storeProp = (arr, name, value) => {
    arr.forEach(sensor => {
        sensor[name] = value;
    });
}

export const updateMetricPercentiles = (p, arr, metricSelected) => {

    if (!arr.length) {
        console.log(`%c can't calculate metric percentiles because there are no devices`, GGConsts.CONSOLE_WARN);
        return;
    }

    arr.sort((a, b) => b[metricSelected] - a[metricSelected]);

    const cutoff = _.round(arr.length * p) || 1;
    const top = arr.slice(0, cutoff);
    const bottom = arr.slice(cutoff, arr.length);

    storeProp(top, 'metricPercentile', 'top');
    storeProp(bottom, 'metricPercentile', 'bottom');

    const updatedArr = [...bottom, ...top];

    return updatedArr;

}

export const updateDevicePercentiles = (arr) => {

    if (!arr.length) {
        console.log(`%c can't calculate metric percentiles because there are no devices`, GGConsts.CONSOLE_WARN);
        return;
    }

    let cells = [...arr];
    const cutoffOne = Math.ceil(cells.length * 0.33);
    const cutoffTwo = Math.ceil(cells.length * 0.66);

    if (cells.length > 1) {
        cells.sort((a, b) => b['Total Devices'] - a['Total Devices']);
    }

    let top, middle, bottom;

    top = cells.slice(0, cutoffOne || cells.length);

    if (cells.length < 2) {
        cells[0].devicesPercentile = 'bottom';
        cells[0].devicesPercentileTotal = cells[0]['Total Devices'];

        return cells;
    }
    else if (cells.length < 3) {
        cells[0].devicesPercentile = 'top';
        cells[0].devicesPercentileTotal = cells[0]['Total Devices'];
        cells[1].devicesPercentile = 'bottom';
        cells[1].devicesPercentileTotal = cells[1]['Total Devices'];

        return cells;
    }

    else {
        let top = cells.slice(0, cutoffOne);
        let middle = cells.slice(cutoffOne, cutoffTwo);
        let bottom = cells.slice(cutoffTwo, cells.length);

        storeProp(top, 'devicesPercentile', 'top');
        storeProp(middle, 'devicesPercentile', 'middle');
        storeProp(bottom, 'devicesPercentile', 'bottom');

        cells = [...top, ...middle, ...bottom];

        return cells;
    }
}

// ## Apply Device and Metric Percentiles
export const composePercentiles = (cells, metricSelected, threshold) => {
    // separate data into arrays that are filler and ones that have data
    const cellsEmpty = [];
    let cellsData = [];

    cells.forEach(cell => {
        if (cell[metricSelected] !== '-') {
            cellsData.push(cell);
        }
        else {
            cellsEmpty.push(cell);
        }
    });

    if (cellsData.length) {
        // 1. calculate and save Device percentiles
        cellsData = updateMetricPercentiles(threshold, cellsData, metricSelected);

        // 2. Calculate and save Metric percentiles
        cellsData = updateDevicePercentiles(cellsData);

        // 3. Calculate and save total devices in this cohort
        const total = cellsData.reduce((total, amount) => total + amount['Total Devices'], 0);
        storeProp(cellsData, 'devicesPercentileTotal', total);

    }
    // 4. Merge cells
    cells = [...cellsData, ...cellsEmpty];

    return cells;

}

export const OneZeroOrNull = () => {
    const rDum = Math.floor(Math.random() * 3);
    let rtn = 0;
    (rDum === 0) ? rtn = 0 : (rDum === 1) ? rtn = 1 : rtn = null;
    return rtn;
}
