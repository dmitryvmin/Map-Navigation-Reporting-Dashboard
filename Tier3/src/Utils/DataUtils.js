import GGConsts from '../Constants';
import _ from 'lodash';

export const filterSensorsByLoc = (sensors, index, location) => {
    const filtered = sensors.filter(f => f.facility.regions[`tier${index}`] === location);
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
            return a;
        }

        if (_.isArray(t)) {
            t = t.reduce((a, b) => a + b, 0);
        }

        a.push(t);

        return a;

    }, []);

    // const unique = _.uniqBy(reduced);
    const total = reduced.reduce((a, b) => a + b, 0)

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
        orange: 0,
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

    const cutoff = _.round(arr.length * p) || 0;
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
        cells[0].devicesPercentile = 'top';
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
