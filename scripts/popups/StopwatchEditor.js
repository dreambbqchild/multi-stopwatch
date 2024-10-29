import { TimeSpan, TimeSpanCollection } from "../models/TimeSpan.js";
import ElementFactory from "../services/ElementFactory.js";
import GrandDispatch from "../services/GrandDispatch.js";
import StopwatchService, { StopwatchEventNames } from "../services/StopwatchService.js";

const formatDate = (date) => {
    const parts = date.toLocaleDateString().split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

const formatTime = (date) => date.toLocaleTimeString('en-GB');

class StopwatchTimeSpan extends HTMLElement {
    #startDate;
    #startTime;
    #endDate;
    #endTime;

    start = null;
    end = null;  

    connectedCallback() {
        let button = null;
        ElementFactory.appendChildrenTo(this, 
            this.#startDate = ElementFactory.createElement('input', {type: 'date', value: formatDate(this.start)}),
            this.#startTime = ElementFactory.createElement('input', {type: 'time', value: formatTime(this.start)}),
            ElementFactory.createElement('span', {textContent: ' to '}),
            this.#endDate = ElementFactory.createElement('input', {type: 'date', value: formatDate(this.end)}),
            this.#endTime = ElementFactory.createElement('input', {type: 'time', value: formatTime(this.end)}),
            button = ElementFactory.createElement('button', {type: 'button', textContent: '🗑'})
        );        

        button.addEventListener('click', () => this.parentElement.removeChild(this));

        for(const input of [this.#startDate, this.#startTime])
            input.addEventListener('change', () => this.start = new Date(`${this.#startDate.value} ${this.#startTime.value}`));

        for(const input of [this.#endDate, this.#endTime])
            input.addEventListener('change', () => this.end = new Date(`${this.#endDate.value} ${this.#endTime.value}`));    
    }
}

customElements.define('stopwatch-timespan', StopwatchTimeSpan);

class StopwatchEditor extends HTMLElement {
    #container = null;
    #stopwatch = null;

    #getElementForTimeSpan = (t) => {
        const stopwatchTimeSpan = document.createElement('stopwatch-timespan');
        stopwatchTimeSpan.start = t.start;
        stopwatchTimeSpan.end = t.end;
        return stopwatchTimeSpan;
    };

    onOk() {
        const result = [];
        for(const {start, end} of this.#container.children) {
            result.push({start, end});
        }

        result.sort((a, b) => b.start.getTime() - a.end.getTime());
        this.#stopwatch.timeSpans = new TimeSpanCollection(result);
        StopwatchService.save(this.#stopwatch);
        GrandDispatch.dispatchEvent(StopwatchEventNames.edited, this.#stopwatch);
    }

    forStopwatch(stopwatch) {
        let added = false;
        for(const t of stopwatch.timeSpans.getTimeSpans().filter(t => t.end)) {            
            this.#container.appendChild(this.#getElementForTimeSpan(t));
            added = true;
        }

        if(!added)
            this.#getElementForTimeSpan(new TimeSpan(new Date(), new Date()));

        this.#stopwatch = stopwatch;
    }

    connectedCallback() {
        this.innerHTML = `<div class="flex flex-direction-column">
            <div style="height: 50vh; overflow-y: scroll;" class="container"></div>
            <button class="flex-grow-1 bg-green margin-1em" type="button">Add Time</button>
        </div>`;

        this.#container = this.querySelector('.container');
        const addTime = this.querySelector('button');
        addTime.addEventListener('click', () => {
            this.#container.appendChild(this.#getElementForTimeSpan(new TimeSpan(new Date(), new Date())));
        });
    }
}

customElements.define('stopwatch-editor', StopwatchEditor);