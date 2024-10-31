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
    edited: 'editedstopwatch',
    deleted: 'deletedstopwatch',
    changeName: 'changednamestopwatch'
}

function *stopwatchIterator() {
    for(const key of stopwatchOrder)
        yield stopwatches[key];
}

export default class StopwatchService {
    static get stopwatches() { return stopwatchIterator(); }

    static save(stopwatch) {
        if(stopwatchOrder.indexOf(stopwatch.key) < 0)
            stopwatchOrder.push(stopwatch.key);

        StorageService.save({key: `${prefix}${stopwatch.key}`, value: stopwatch.timeSpans});
        StorageService.save({key: stopwatchOrderKey, value: stopwatchOrder})
    }

    static delete(key) {
        delete stopwatches[key];
        StorageService.delete(`${prefix}${key}`);
        const keyIndex = stopwatchOrder.indexOf(key);
        stopwatchOrder.splice(keyIndex);
        StorageService.save({key: stopwatchOrderKey, value: stopwatchOrder});

        GrandDispatch.dispatchEvent(StopwatchEventNames.deleted, {key});
    }

    static changeName(from, to) {
        stopwatches[to] = stopwatches[from];
        delete stopwatches[from];
        StorageService.delete(`${prefix}${from}`);

        stopwatches[to].key = to;
        const fromIndex = stopwatchOrder.indexOf(from);
        stopwatchOrder[fromIndex] = to;

        this.save(stopwatches[to]);
        GrandDispatch.dispatchEvent(StopwatchEventNames.changeName, {from, to});
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