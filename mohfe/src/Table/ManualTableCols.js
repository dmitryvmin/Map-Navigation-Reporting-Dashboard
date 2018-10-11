const manualTableCols = [
    { id: 'status', numeric: false, disablePadding: true, label: 'Status'},
    { id: 'errorcount', numeric: false, disablePadding: true, label: 'Error Count'},
    { id: 'lasttemp', numeric: true, disablePadding: false, label: 'Last Temp (C)'},
    { id: 'brand', numeric: false, disablePadding: false, label: 'Brand/Model'},
    { id: 'facility', numeric: false, disablePadding: false, label: 'Facility'},
    { id: 'lastping', numeric: true, disablePadding: false, label: 'Last Ping'},
    { id: 'uploaddate', numeric: true, disablePadding: false, label: 'Uploaded'}
];

export default manualTableCols;