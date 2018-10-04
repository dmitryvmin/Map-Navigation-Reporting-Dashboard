const manualTableCols = [
    { id: 'status', numeric: false, disablePadding: true, label: 'Status'},
    { id: 'uploaddate', numeric: true, disablePadding: false, label: 'Upload Date'},
    { id: 'lasttemp', numeric: true, disablePadding: false, label: 'Last Temp (C)'},
    { id: 'brand', numeric: false, disablePadding: false, label: 'Brand/Model'},
    { id: 'facility', numeric: false, disablePadding: false, label: 'Facility'},
    { id: 'lastping', numeric: true, disablePadding: false, label: 'Last Ping'},
];

export default manualTableCols; 