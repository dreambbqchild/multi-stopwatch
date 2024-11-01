import './extensions/DateExtensions.js';

if(__webpack_chunkname__ === 'main'){
    import('../style/main.css');
    import('./elements/MainElement.js');
} else {
    import('../style/report.css');
    import('./elements/ReportElement.js');
}