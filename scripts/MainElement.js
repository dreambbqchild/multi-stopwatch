import './ElementLadder.js';
import './ModalDialog.js';
import './StopwatchTracker.js';

import './popups/Popups.js';
import StopwatchService, { StopwatchEventNames } from './services/StopwatchService.js';

class MainButton extends HTMLElement {
    callback = null;

    get color() {return this.getAttribute('color');}
    get label() {return this.getAttribute('label');}

    connectedCallback() {
        this.innerHTML = `<div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-${this.color}" type="button">${this.label}</button>
        </div>`;

        this.querySelector('button').addEventListener('click', () => { if(this.callback) this.callback() });
    }
}

customElements.define('main-button', MainButton);

class MainElement extends HTMLElement {
    #elementLadder = null;

    constructor() {
        super();

        this.addEventListener(StopwatchEventNames.newStopwatch, (e) => this.#addStopwatch(e.detail));
    }

    #addStopwatch(stopwatch) {
        const tracker = document.createElement('stopwatch-tracker')
        tracker.labelFor = stopwatch.key;
        tracker.timespans = stopwatch.value;

        this.#elementLadder.add(tracker);

        tracker.addEventListener('dblclick', () => {
            if(!tracker.isActive) {
                for(const t of StopwatchService.stopwatches.filter(t => t.isActive))
                    t.stop();

                tracker.start();
            }
            else
                tracker.stop();
        });
    }

    connectedCallback() {
        this.innerHTML = `<modal-dialog></modal-dialog>
        <div class="root">
            <element-ladder></element-ladder>
            <main-button color="blue" label="Get Report"></main-button>
            <main-button color="red" label="Reset All"></main-button>
            <main-button color="green" label="Add New"></main-button>
        </div>`;

        this.#elementLadder = this.querySelector('element-ladder');
        const modalDialog = this.querySelector('modal-dialog');

        for(const button of this.querySelectorAll('main-button')) {
            if(button.label === 'Add New')
                button.callback = () => modalDialog.open('Add New Stopwatch', document.createElement('add-new'));
        }

        for(const stopwatch of StopwatchService.stopwatches)
            this.#addStopwatch(stopwatch);
    }
}

customElements.define('main-element', MainElement);