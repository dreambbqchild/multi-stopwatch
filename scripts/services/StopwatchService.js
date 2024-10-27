import { TimeSpanCollection } from "../models/TimeSpan.js";
import StorageService from "./StorageService.js";

const stopwatches = [];

for(const kvp of StorageService.load())
    stopwatches.push({key: kvp.key, value: new TimeSpanCollection(kvp.value)});

const dispatch = (srcElement, name, detail) => srcElement.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

const StopwatchEventNames = {
    newStopwatch: 'newstopwatch'
}

export default class StopwatchService {
    static get stopwatches() {return [...stopwatches];}

    static newStopwatch(srcElement, key) {
        const kvp = {key, value: new TimeSpanCollection()};
        StorageService.save(kvp);
        dispatch(srcElement, StopwatchEventNames.newStopwatch, kvp);
    }
}

export {StopwatchEventNames};