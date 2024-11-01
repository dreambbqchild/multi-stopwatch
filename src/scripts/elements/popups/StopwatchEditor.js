import { TimeSpan, TimeSpanCollection } from "../../models/TimeSpan.js";
import ElementFactory from "../../services/ElementFactory.js";
import GrandDispatch from "../../services/GrandDispatch.js";
import StopwatchService, { StopwatchEventNames } from "../../services/StopwatchService.js";

const constrainToDeviceResolution = (date) => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent))
        return new Date(date.getTime() - (date.getTime() % 60000));

    return date;
}

const createDateTime = (label, parent, date) => {
    const [div] = ElementFactory.appendElementsTo(parent, ElementFactory.createElement('div', {classList: 'flex date-time'}))    

    const result = ElementFactory.appendElementsTo(div, ElementFactory.beginCreateElements()
        ('span', {textContent: `${label}:\u00A0`, classList: 'flex-grow-1', style:{textAlign: 'right'}})
        ('input', {type: 'datetime-local', step: 1, valueAsNumber: date.toDateTimeLocalMilliseconds()})
    );

    result.shift();

    return result;
}

class StopwatchTimeSpan extends HTMLElement {
    #startDateTime;
    #endDateTime;
    #start = null;
    #end = null;

    get start() {return this.#start;};
    set start(value) {this.#start = constrainToDeviceResolution(value); }
    
    get end() {return this.#end;};
    set end(value) {this.#end = constrainToDeviceResolution(value); }

    connectedCallback() {
        let preparingToDelete = false;

        const [containerDiv] = ElementFactory.appendElementsTo(this, ElementFactory.createElement('div', {classList: 'flex'}));
        const [leftDiv, rightDiv] = ElementFactory.appendElementsTo(containerDiv, ElementFactory.beginCreateElements()
            ('div', {classList: 'flex flex-direction-column date-times'})
            ('div', {classList: 'flex flex-grow-1 justify-content-center align-items-center', style:{minWidth: '3em'}})
        );

        [this.#startDateTime] = createDateTime('Start', leftDiv, this.start);
        [this.#endDateTime] = createDateTime('End', leftDiv, this.end);
        
        const [cmdDelete] = ElementFactory.appendElementsTo(rightDiv, ElementFactory.createElement('button', {type: 'button', textContent: '🗑', classList: 'bg-light-gray'}));

        cmdDelete.addEventListener('click', () => {
            preparingToDelete = !preparingToDelete;
            leftDiv.style.visibility = preparingToDelete ? 'hidden' : null;
            cmdDelete.textContent = preparingToDelete ? '↩️' : '🗑';

            if(preparingToDelete) {
                this.end = this.start = null;
            } else {
                this.start = new Date(this.#startDateTime.valueAsNumber);
                this.end = new Date(this.#endDateTime.valueAsNumber);
            }
        });

        const onChange = (element, target, mathFn) => {
            if(element.value === '')
                return;

            let value = new Date(element.value);
            value = new Date(mathFn(value.getTime(), this[target === 'start' ? 'end' : 'start'].getTime()));
            this[target] = value;

            element.valueAsNumber = value.toDateTimeLocalMilliseconds();
        }
        
        this.#startDateTime.addEventListener('change', () => onChange(this.#startDateTime, 'start', Math.min));
        this.#endDateTime.addEventListener('change', () => onChange(this.#endDateTime, 'end', Math.max));
    }
}

customElements.define('stopwatch-timespan', StopwatchTimeSpan);

class StopwatchEditor extends HTMLElement {
    #container = null;
    #txtRename = null;
    #stopwatch = null;
    #preparingToDelete = false;

    #getElementForTimeSpan = (t) => {
        const stopwatchTimeSpan = document.createElement('stopwatch-timespan');
        stopwatchTimeSpan.start = t.start;
        stopwatchTimeSpan.end = t.end;
        return stopwatchTimeSpan;
    };

    onOk() {
        if(this.#preparingToDelete) {
            StopwatchService.delete(this.#stopwatch.key);
            return;
        }

        const result = [];
        for(const {start, end} of this.#container.children) {
            if(!start)
                continue;

            result.push({start, end});
        }

        if(this.#txtRename.value != this.#stopwatch.key)
            StopwatchService.changeName(this.#stopwatch.key, this.#txtRename.value);

        result.sort((a, b) => b.start.getTime() - a.end.getTime());
        this.#stopwatch.timeSpans = new TimeSpanCollection(result);
        StopwatchService.save(this.#stopwatch);
        GrandDispatch.dispatchEvent(StopwatchEventNames.edited, this.#stopwatch);
    }

    forStopwatch(stopwatch) {
        let wasAdded = false;
        this.#txtRename.value = stopwatch.key;
        for(const t of stopwatch.timeSpans.getTimeSpans()) {
            if(!t.end)
                continue;

            this.#container.add(this.#getElementForTimeSpan(t));
            wasAdded = true;
        }

        if(!wasAdded)
            this.#container.add(this.#getElementForTimeSpan(new TimeSpan(new Date(), new Date())));

        this.#stopwatch = stopwatch;
    }

    connectedCallback() {
        let _ = null, cmdAddTime = null, deleteDiv = null;
        
        const [renameDiv] = ElementFactory.appendElementsTo(this, ElementFactory.createElement('div', {classList:'flex align-items-center ', style: {marginBottom: '1em'}}));
        [_, this.#txtRename, deleteDiv] = ElementFactory.appendElementsTo(renameDiv, ElementFactory.beginCreateElements()
            ('label', {textContent: 'Rename:', style: {paddingRight: '0.5em'}})
            ('input')
            ('div', {classList:'flex flex-grow-1', style: {justifyContent: 'right', minWidth: '2em'}})
        );

        const [cmdDeleteStopwatch] = ElementFactory.appendElementsTo(deleteDiv, ElementFactory.createElement('button', {type: 'button', textContent: '🗑', classList: 'bg-light-gray'}));

        const [bodyDiv] = ElementFactory.appendElementsTo(this, ElementFactory.createElement('div', {classList: 'flex flex-direction-column', style: {height: '50vh', position: 'relative'}}));

        ElementFactory.appendElementsTo(bodyDiv, ElementFactory.createElement('div', {textContent: 'Press Ok to remove this stopwatch.', style: {position: 'absolute', top: '0', zIndex: -1, color: 'red'}}));

        [this.#container, cmdAddTime] = ElementFactory.appendElementsTo(bodyDiv, ElementFactory.beginCreateElements()
            ('element-ladder', {style: {height: '100%', overflowY: 'scroll', backgroundColor: 'var(--background-gray-color)'}})
            ('button', {classList:'flex-grow-1 bg-green margin-1em', type: 'button', textContent: 'Add Time'})
        );

        cmdDeleteStopwatch.addEventListener('click', () => {
            let icon = '↩️'
            let visibility = 'hidden';
            
            this.#preparingToDelete = !this.#preparingToDelete;

            if(!this.#preparingToDelete) {
                icon = '🗑';
                visibility = null;                
            }

            cmdAddTime.style.visibility = this.#container.style.visibility = visibility;
            cmdDeleteStopwatch.textContent = icon;

            this.#txtRename.disabled = this.#preparingToDelete;
        });

        cmdAddTime.addEventListener('click', () => {
            this.#container.add(this.#getElementForTimeSpan(new TimeSpan(new Date(), new Date())));
        });
    }
}

customElements.define('stopwatch-editor', StopwatchEditor);