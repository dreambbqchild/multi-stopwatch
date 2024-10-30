import './ElementLadder.js';
import './ModalDialog.js';
import './StopwatchTracker.js';

import './popups/Popups.js';
import GrandDispatch from './services/GrandDispatch.js';
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

class MainLinkButton extends HTMLElement {    
    get url() {return this.getAttribute('url');}
    get color() {return this.getAttribute('color');}
    get label() {return this.getAttribute('label');}

    connectedCallback() {
        this.innerHTML = `<form action="${this.url}" target="_blank">
            <div class="flex flex-direction-column margin-1em">
                <button class="w-100 padding-1em bg-${this.color}">${this.label}</button>
            </div>
        </form>`;
    }
}

customElements.define('main-link-button', MainLinkButton);

class MainElement extends HTMLElement {
    #elementLadder = null;
    #trackers = [];

    constructor() {
        super();

        GrandDispatch.addEventListener(StopwatchEventNames.new, (e) => this.#addStopwatch(e.detail));
    }

    #addStopwatch(stopwatch) {
        const tracker = document.createElement('stopwatch-tracker')
        tracker.stopwatch = stopwatch;
        this.#trackers.push(tracker);

        this.#elementLadder.add(tracker);

        tracker.addEventListener('dblclick', () => {
            if(!tracker.stopwatch.isActive) {
                for(const t of this.#trackers.filter(t => t.stopwatch.isActive))
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
            <element-ladder class="user-select-none"></element-ladder>
            <main-link-button color="blue" label="Get Report" url="report.html"></main-link-button>
            <main-button color="red" label="Reset All"></main-button>
            <main-button color="green" label="Add New"></main-button>
        </div>`;

        this.#elementLadder = this.querySelector('element-ladder');
        const modalDialog = this.querySelector('modal-dialog');

        for(const button of this.querySelectorAll('main-button')) {
            if(button.label === 'Add New')
                button.callback = () => modalDialog.open('Add New Stopwatch', 'add-new');
            else if(button.label === 'Reset All')
                button.callback = () => modalDialog.open('Are you sure?', 'are-you-sure');
        }

        for(const stopwatch of StopwatchService.stopwatches)
            this.#addStopwatch(stopwatch);
    }
}

customElements.define('main-element', MainElement);