import {TimeSpan, TimeSpanCollection} from "../TimeSpan.js";

class StopwatchTracker extends HTMLElement {
    static observedAttributes = ['label-for'];

    #currentElapsed = null;
    #totalElapsed = null;
    #label = null;
    #hInterval = null;
    
    timespans = new TimeSpanCollection();

    get isActive() {return this.timespans.isActive;}
    get topValue() {return this.timespans.topValue;}

    get labelFor() {return this.getAttribute('label-for');}
    set labelFor(value) {this.setAttribute('label-for', value);}

    start() {
        this.#currentElapsed.textContent = '00:00:00';
        
        this.timespans.startNew();
        this.classList.add('is-active');
        
        this.#hInterval = setInterval(() => this.#paint(), 1000);
    }

    stop() {
        this.timespans.stop();        
        this.classList.remove('is-active');
        clearInterval(this.#hInterval);
        this.#hInterval = null;
    }

    #paint() {        
        this.#totalElapsed.textContent = this.timespans;
        if(this.isActive)
            this.#currentElapsed.textContent = this.timespans.topValue;
    }

    connectedCallback() {
        this.innerHTML = `<div class="flex flex-direction-row inset-text-shadow padding-1em user-select-none">
    <div class="flex-grow-1">
        <p style="font-size: 1.5em" class="font-weight-bold"><span class="label"></span></p>
        <p style="font-size: 1.5em" class="current">Current: <span class="current-elapsed">00:00:00</span></p>
        <p>Total Time Accumulated: <span class="total-elapsed">00:00:00</span></p>
    </div>
    <div class="flex align-items-center"><a href="#">• • •</a></div>
</div>`;

        this.#label = this.querySelector(".label");
        this.#currentElapsed = this.querySelector(".current-elapsed");
        this.#totalElapsed = this.querySelector(".total-elapsed");        

        this.#label.textContent = this.labelFor;
    }

    attributeChangedCallback(name, _, newValue) {        
        if(name === 'label-for' && this.#label)
            this.#label.textContent = newValue;
    }
}

customElements.define("stopwatch-tracker", StopwatchTracker);