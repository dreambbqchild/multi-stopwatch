import Stopwatch from "../models/Stopwatch.js";
import { TimeSpanCollection } from "../models/TimeSpan.js";
import GrandDispatch from "./GrandDispatch.js";
import StorageService from "./StorageService.js";

const stopwatches = [];

for(const kvp of StorageService.load())
    stopwatches.push(new Stopwatch(kvp.key, new TimeSpanCollection(kvp.value)));

const StopwatchEventNames = {
    newStopwatch: 'newstopwatch',
    resetStopwatch: 'resetStopwatch'
}

export default class StopwatchService {
    static get stopwatches() {return [...stopwatches];}

    static save(stopwatch) {
        StorageService.save({key: stopwatch.key, value: stopwatch.timeSpans});
    }

    static newStopwatch(key) {
        const stopwatch = new Stopwatch(key);
        this.save(stopwatch);
        GrandDispatch.dispatchEvent(StopwatchEventNames.newStopwatch, stopwatch);
    }

    static resetAll() {
        for(const stopwatch of stopwatches) {
            stopwatch.timeSpans = new TimeSpanCollection();
            this.save(stopwatch);
            GrandDispatch.dispatchEvent(StopwatchEventNames.resetStopwatch, stopwatch);
        }
    }
}

export {StopwatchEventNames};