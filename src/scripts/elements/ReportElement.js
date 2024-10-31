import { secondsAsTimeString, truncateMilliseconds } from "../models/TimeSpan.js";
import ElementFactory from "../services/ElementFactory.js";
import StopwatchService from "../services/StopwatchService.js";

class ReportElement extends HTMLElement {
    connectedCallback() {
        let totalSeconds = 0;
        for(const stopwatch of StopwatchService.stopwatches) {
            if(stopwatch.timeSpans == 0)
                continue;

            const table = ElementFactory.appendElementsTo(this, ElementFactory.beginCreateElements()
                ('h2', {textContent: stopwatch.key})
                ('table', {classList: 'location-report'})
            )[1];

            const [thead, tbody, tfoot] = ElementFactory.appendElementsTo(table, ElementFactory.beginCreateElements()
                ('thead')
                ('tbody')
                ('tfoot')
            );

            const [theadRow] = ElementFactory.appendElementsTo(thead, ElementFactory.createElement('tr'));
            ElementFactory.appendElementsTo(theadRow, ElementFactory.beginCreateElements()
                ('td', {textContent: 'Start'})
                ('td', {textContent: 'End'})
                ('td', {textContent: 'Duration'})
            );

            for(const timeSpan of stopwatch.timeSpans.getTimeSpans()) {
                let {start, end} = timeSpan;
                if(!end)
                    end = truncateMilliseconds(new Date());

                let [tr] = ElementFactory.appendElementsTo(tbody, ElementFactory.createElement('tr'));

                ElementFactory.appendElementsTo(tr, ElementFactory.beginCreateElements()
                    ('td', {textContent: `${start.toLocaleDateString("en-US")} ${start.toLocaleTimeString('en-US')}`})
                    ('td', {textContent: `${end.toLocaleDateString("en-US")} ${end.toLocaleTimeString('en-US')}`})
                    ('td', {textContent: `${timeSpan}`})
                );
            }

            const [totalRow] = ElementFactory.appendElementsTo(tfoot, ElementFactory.createElement('tr', {classList: 'font-weight-900'}));
            ElementFactory.appendElementsTo(totalRow, ElementFactory.beginCreateElements()
                ('td', {textContent: `Total:`, colSpan: 2, classList: 'text-align-right'})
                ('td', {textContent: `${stopwatch.timeSpans}`})
            );

            totalSeconds += stopwatch.timeSpans;
        }

        ElementFactory.appendElementsTo(this, ElementFactory.createElement('h1', {textContent: `Grand Total: ${secondsAsTimeString(totalSeconds)}`}));
    }
}

customElements.define('report-element', ReportElement);