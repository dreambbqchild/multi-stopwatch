import { TimeSpanCollection } from "./TimeSpan.js";

export default class Stopwatch {
    constructor(key, value) {
        this.key = key;
        this.timeSpans = value ?? new TimeSpanCollection();
    }

    get isActive() {
        return this.timeSpans.isActive;
    }

    startNew() {
        this.timeSpans.startNew();
    }

    stop() {
        this.timeSpans.stop();
    }
}