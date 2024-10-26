import './ElementLadder.js';
import './ModalDialog.js';
import './StopwatchTracker.js';

import './popups/Popups.js';

import StorageService from './services/StorageService.js';

const createTracker = (name, value) => {
    const tracker = document.createElement('stopwatch-tracker')
    tracker.labelFor = name;
    tracker.timespans = value;
    return tracker;
}

class MainElement extends HTMLElement {
    #elementLadder = null;
    #trackers = [...StorageService.load()].map(kvp => createTracker(kvp.key, kvp.value));

    newStopwatch(kvp) {
        const tracker = createTracker(kvp.key, kvp.value);
        this.#trackers.push(tracker)
        this.#addTracker(tracker);
    }

    #addTracker(tracker) {
        this.#elementLadder.add(tracker);

        tracker.addEventListener('dblclick', () => {
            if(!tracker.isActive) {
                for(const t of this.#trackers.filter(t => t.isActive))
                    t.stop();

                tracker.start();
            }
            else
                tracker.stop();
        });
    }

    connectedCallback() {
        this.innerHTML = `<modal-dialog></modal-dialog>
        <element-ladder></element-ladder>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-blue" type="button">Get Report</button>
        </div>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-red" type="button">Reset All</button>
        </div>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-green" type="button">Add New</button>
        </div>`;

        this.#elementLadder = this.querySelector('element-ladder');
        const modalDialog = this.querySelector('modal-dialog');

        for(const button of this.querySelectorAll('button')){
            if(button.textContent === 'Add New')
                button.addEventListener('click', () => modalDialog.open('Add New', document.createElement('add-new')));
        }

        for(const tracker of this.#trackers)
            this.#addTracker(tracker);
    }
}

customElements.define('main-element', MainElement);