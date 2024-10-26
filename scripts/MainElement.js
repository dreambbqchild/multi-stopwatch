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

const trackers = [...StorageService.load()].map(kvp => createTracker(kvp.key, kvp.value));

class MainElement extends HTMLElement {
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

        const elementLadder = this.querySelector('element-ladder');
        const modalDialog = this.querySelector('modal-dialog');

        for(const button of this.querySelectorAll('button')){
            if(button.textContent === 'Add New'){
                button.addEventListener('click', () => modalDialog.open('Add New', document.createElement('add-new')));
            }
        }

        for(const tracker of trackers){
            elementLadder.add(tracker);

            tracker.addEventListener('dblclick', () => {
                if(!tracker.isActive){
                    for(const t of trackers.filter(t => t.isActive))
                        t.stop();

                    tracker.start();
                }
                else
                    tracker.stop();
            });
        }
    }
}

customElements.define('main-element', MainElement);