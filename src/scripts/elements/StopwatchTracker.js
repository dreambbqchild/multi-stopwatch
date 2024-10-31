import Stopwatch from "../models/Stopwatch.js";
import GrandDispatch from "../services/GrandDispatch.js";
import StopwatchService, { StopwatchEventNames } from "../services/StopwatchService.js";

class StopwatchTracker extends HTMLElement {
    #currentElapsed = null;
    #totalElapsed = null;
    #label = null;
    #hInterval = null;
    #stopwatch = new Stopwatch();

    constructor() {
        super();

        GrandDispatch.addEventListener(StopwatchEventNames.reset, (e) => {
            if(e.detail.key === this.#stopwatch.key) {
                if(this.#hInterval)
                    this.#stopTimer();
                
                this.#paint();
            }
        });

        GrandDispatch.addEventListener(StopwatchEventNames.edited, (e) => {
            if(e.detail.key === this.#stopwatch.key)                
                this.#paint();
        });

        GrandDispatch.addEventListener(StopwatchEventNames.changeName, (e) => {
            const {from, to} = e.detail;
            if(from === this.#label.textContent)
                this.#label.textContent = to;
        });

        GrandDispatch.addEventListener(StopwatchEventNames.deleted, (e) => {
            const {key} = e.detail;
            if(key === this.#label.textContent)
                this.parentElement.parentElement.remove(this);
        });
    }

    get stopwatch() {return this.#stopwatch;}
    set stopwatch(value) {
        this.#stopwatch = value;
        this.#paint();

        if(this.#stopwatch.isActive)
            this.#startTimer();
    }

    #startTimer() {
        this.classList.add('is-active');
        this.#hInterval = setInterval(() => this.#paint(), 1000);
    }

    #stopTimer() {
        this.classList.remove('is-active');
        clearInterval(this.#hInterval);
        this.#hInterval = null;
    }

    start() {
        this.#currentElapsed.textContent = '00:00:00';
        
        this.#stopwatch.startNew();
        this.#startTimer();

        StopwatchService.save(this.#stopwatch);
    }

    stop() {
        this.#stopwatch.stop();
        this.#stopTimer();

        StopwatchService.save(this.#stopwatch);
    }

    #paint() {
        if(!this.#totalElapsed)
            return;

        this.#totalElapsed.textContent = this.stopwatch.timeSpans;
        if(this.stopwatch.isActive)
            this.#currentElapsed.textContent = this.stopwatch.timeSpans.topValue;
    }

    connectedCallback() {
        this.innerHTML = `<div class="flex flex-direction-row inset-text-shadow padding-1em user-select-none">
    <div class="flex-grow-1">
        <p style="font-size: 1.5em" class="font-weight-bold"><span class="label"></span></p>
        <p style="font-size: 1.5em" class="current">Current: <span class="current-elapsed">00:00:00</span></p>
        <p>Total: <span class="total-elapsed">00:00:00</span></p>
    </div>
    <div class="flex align-items-center"><a href="#">• • •</a></div>
</div>`;

        this.#label = this.querySelector(".label");
        this.#currentElapsed = this.querySelector(".current-elapsed");
        this.#totalElapsed = this.querySelector(".total-elapsed");
        this.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();

            const modalDialog = document.querySelector('modal-dialog');
            const editor = modalDialog.open(`Edit ${this.#stopwatch.key}`, 'stopwatch-editor');
            editor.forStopwatch(this.#stopwatch);
        });

        this.#label.textContent = this.#stopwatch.key;

        this.#paint();
    }
}

customElements.define("stopwatch-tracker", StopwatchTracker);