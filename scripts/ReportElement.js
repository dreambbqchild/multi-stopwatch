import ElementFactory from "./services/ElementFactory.js";
import StopwatchService from "./services/StopwatchService.js";

class ReportElement extends HTMLElement {
    connectedCallback() {
        for(const stopwatch of StopwatchService.stopwatches) {
            if(stopwatch.timeSpans == 0)
                continue;

            const table = ElementFactory.appendElementsTo(this, ElementFactory.beginCreateElements()
                ('h1', {textContent: stopwatch.key})
                ('hr')
                ('table', {classList: 'location-report'})
            )[2];

            for(const timeSpan of stopwatch.timeSpans.getTimeSpans()){
                let tr = ElementFactory.createElement('tr');
                table.appendChild(tr);

                ElementFactory.appendElementsTo(tr, ElementFactory.beginCreateElements()
                    ('td', {textContent: `${timeSpan.start.toLocaleDateString("en-US")} ${timeSpan.start.toLocaleTimeString('en-US')}`})
                    ('td', {textContent: `${timeSpan.end.toLocaleDateString("en-US")} ${timeSpan.end.toLocaleTimeString('en-US')}`})
                    ('td', {textContent: `${timeSpan}`})
                );
            }

            const totalRow = ElementFactory.createElement('tr', {classList: 'font-weight-900'});
            table.appendChild(totalRow);

            ElementFactory.appendElementsTo(totalRow, ElementFactory.beginCreateElements()
                ('td', {textContent: `Total:`, colSpan: 2, classList: 'text-align-right'})
                ('td', {textContent: `${stopwatch.timeSpans}`})
            );
        }
    }
}

customElements.define('report-element', ReportElement);