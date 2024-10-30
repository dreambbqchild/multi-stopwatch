import Stopwatch from "../models/Stopwatch.js";
import { TimeSpanCollection } from "../models/TimeSpan.js";
import GrandDispatch from "./GrandDispatch.js";
import StorageService from "./StorageService.js";

const prefix = 'multi-stopwatch-';
const stopwatchOrderKey = 'stopwatch-order';
const stopwatchOrder = StorageService.load(stopwatchOrderKey) ?? [];
const stopwatches = {};

for(const kvp of StorageService.loadWithPrefix(prefix)) {
    const key = kvp.key.substring(prefix.length)
    stopwatches[key] = new Stopwatch(key, new TimeSpanCollection(kvp.value));
}

const StopwatchEventNames = {
    new: 'newstopwatch',
    reset: 'resetstopwatch',
    edited: 'editedstopwatch'
}

function *stopwatchIterator() {
    for(const key of stopwatchOrder)
        yield stopwatches[key];
}

export default class StopwatchService {
    static get stopwatches() { return stopwatchIterator(); }

    static save(stopwatch) {
        if(!stopwatches[stopwatch.key])
            stopwatchOrder.push(stopwatch.key);

        StorageService.save({key: `${prefix}${stopwatch.key}`, value: stopwatch.timeSpans});        
        StorageService.save({key: stopwatchOrderKey, value: stopwatchOrder})
    }

    static newStopwatch(key) {
        const stopwatch = new Stopwatch(key);
        this.save(stopwatch);
        GrandDispatch.dispatchEvent(StopwatchEventNames.new, stopwatch);
    }

    static resetAll() {
        for(const stopwatch of this.stopwatches) {
            stopwatch.timeSpans = new TimeSpanCollection();
            this.save(stopwatch);
            GrandDispatch.dispatchEvent(StopwatchEventNames.reset, stopwatch);
        }
    }
}

export {StopwatchEventNames};