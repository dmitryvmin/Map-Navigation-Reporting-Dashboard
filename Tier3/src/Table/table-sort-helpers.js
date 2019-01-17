const desc = (a, b, orderBy) => {
    let cellA, cellB;
    if (
        orderBy === 'Alarms' ||
        orderBy === 'Uptime' ||
        orderBy === 'Reporting' ||
        orderBy === 'Holdover'
    ) {
        cellA = (a[orderBy] === '-') ? 0 : a[orderBy];
        cellB = (b[orderBy] === '-') ? 0 : b[orderBy];
    } else {
        cellA = a[orderBy];
        cellB = b[orderBy];
    }

    if (cellB < cellA) {
        return -1;
    }
    if (cellB > cellA) {
        return 1;
    }

    return 0;
}

const stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    return stabilizedThis.map(el => el[0]);
}

const getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export {
    desc,
    stableSort,
    getSorting
};
