const liveTableCols = [
    { id: 'status', numeric: false, disablePadding: true, label: 'Status'},
    { id: 'holdover', numeric: true, disablePadding: false, label: 'Holdover Days'},
    { id: 'lasttemp', numeric: true, disablePadding: false, label: 'Last Reading Temp (C)'},
    { id: 'brand', numeric: false, disablePadding: false, label: 'Brand/Model'},
    { id: 'facility', numeric: false, disablePadding: false, label: 'Facility'},
    { id: 'lastping', numeric: true, disablePadding: false, label: 'Last Ping'},
];

export default liveTableCols; 