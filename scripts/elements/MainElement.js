import './ElementLadder.js';
import './StopwatchTracker.js';

const createTracker = (name) => {
    const tracker = document.createElement('stopwatch-tracker')
    tracker.labelFor = name;
    return tracker;
}

const trackers = [
    createTracker('GBE'),
    createTracker('APE')
];

class MainElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<element-ladder></element-ladder>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-green" type="button">Add New</button>
        </div>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-blue" type="button">Get Report</button>
        </div>
        <div class="flex flex-direction-column margin-1em">
            <button class="w-100 padding-1em bg-red" type="button">Reset All</button>
        </div>`;

        const elementLadder = this.querySelector('element-ladder');
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