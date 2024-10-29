import ElementFactory from "./services/ElementFactory.js";
import StopwatchService from "./services/StopwatchService.js";

class ReportElement extends HTMLElement {
    connectedCallback() {
        for(const stopwatch of StopwatchService.stopwatches) {
            if(stopwatch.timeSpans == 0)
                continue;

            let table = null;
            ElementFactory.appendChildrenTo(this, 
                ElementFactory.createElement('h1', {textContent: stopwatch.key}),
                ElementFactory.createElement('hr'),
                table = ElementFactory.createElement('table', {classList: 'location-report'})
            );

            for(const timeSpan of stopwatch.timeSpans.getTimeSpans()){
                let tr = ElementFactory.createElement('tr');
                table.appendChild(tr);

                ElementFactory.appendChildrenTo(tr,
                    ElementFactory.createElement('td', {textContent: `${timeSpan.start.toLocaleDateString("en-US")} ${timeSpan.start.toLocaleTimeString('en-US')}`}),
                    ElementFactory.createElement('td', {textContent: `${timeSpan.end.toLocaleDateString("en-US")} ${timeSpan.end.toLocaleTimeString('en-US')}`}),
                    ElementFactory.createElement('td', {textContent: `${timeSpan}`})
                );
            }

            let totalRow = ElementFactory.createElement('tr', {classList: 'font-weight-900'});
            table.appendChild(totalRow);

            ElementFactory.appendChildrenTo(totalRow,
                ElementFactory.createElement('td', {textContent: `Total:`, colSpan: 2, classList: 'text-align-right'}),
                ElementFactory.createElement('td', {textContent: `${stopwatch.timeSpans}`})
            );
        }
    }
}

customElements.define('report-element', ReportElement);