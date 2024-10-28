import { TimeSpan } from "../models/TimeSpan.js";

const formatDate = (date) => {
    const parts = date.toLocaleDateString().split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

const formatTime = (date) => date.toLocaleTimeString('en-GB');

class StopwatchEditor extends HTMLElement {
    #container = null;

    #getElementForTimeSpan = (t) => {
        const div = document.createElement('div');
        div.style.paddingBottom = '1em';
        
        div.innerHTML = `<input type="date" value="${formatDate(t.start)}"></input>
        <input type="time" value="${formatTime(t.start)}"/></input>
        <span> to </span>
        <input type="date" value="${formatDate(t.end)}"></input>
        <input type="time" value="${formatTime(t.end)}"></input>
        <button type="button">🗑</button>`;
    
        const button = div.querySelector('button');
        button.addEventListener('click', () => this.#container.removeChild(div));

        return div;
    };

    onOk() {
        
    }

    forStopwatch(stopwatch) {
        for(const t of stopwatch.timeSpans.getTimeSpans())
            this.#container.appendChild(this.#getElementForTimeSpan(t));
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