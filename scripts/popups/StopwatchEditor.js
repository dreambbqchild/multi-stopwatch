import { TimeSpan, TimeSpanCollection } from "../models/TimeSpan.js";
import GrandDispatch from "../services/GrandDispatch.js";
import StopwatchService, { StopwatchEventNames } from "../services/StopwatchService.js";

const formatDate = (date) => {
    const parts = date.toLocaleDateString().split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

const formatTime = (date) => date.toLocaleTimeString('en-GB');

class StopwatchEditor extends HTMLElement {
    #container = null;
    #stopwatch = null;

    #getElementForTimeSpan = (t) => {
        const div = document.createElement('div');
        div.style.paddingBottom = '1em';
        
        div.innerHTML = `<input type="date" date-for="start" value="${formatDate(t.start)}"></input>
        <input type="time" time-for="start" value="${formatTime(t.start)}"/></input>
        <span> to </span>
        <input type="date" date-for="end" value="${formatDate(t.end)}"></input>
        <input type="time" time-for="end" value="${formatTime(t.end)}"></input>
        <button type="button">🗑</button>`;
    
        const button = div.querySelector('button');
        button.addEventListener('click', () => this.#container.removeChild(div));

        return div;
    };

    onOk() {
        const result = [];
        for(const element of this.#container.children) {
            var startDate = element.querySelector('[date-for="start"]');
            var startTime = element.querySelector('[time-for="start"]');
            var endDate = element.querySelector('[date-for="end"]');
            var endTime = element.querySelector('[time-for="end"]');

            result.push({start: new Date(`${startDate.value} ${startTime.value}`) ,end: new Date(`${endDate.value} ${endTime.value}`)});
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