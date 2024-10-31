const zeroDate = new Date(0);

const secondsAsTimeString = (secs) => {
    const twoDigits = (num) => num.toString().padStart(2, '0');

    let total = secs;
    const seconds = total % 60;        
    
    total = Math.floor(total / 60);
    const minutes = total % 60;
    const hours = Math.floor(total / 60);
    
    return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

const truncateMilliseconds = (d) => d === null ? null : new Date(parseInt(d.getTime() * 0.001) * 1000);

class TimeSpan {
    #start
    #end

    constructor(start, end) {
        const resolveDate = (v, defaultValue) => {
            if(v === undefined || v === null)
                return defaultValue;

            if(typeof(start) === 'number')
                return new Date(v);

            if(start.constructor === Date)
                return v;

            return defaultValue;
        }        

        this.#start = truncateMilliseconds(resolveDate(start, new Date()));
        this.#end = truncateMilliseconds(resolveDate(end, null));
    }

    get start() {return new Date(this.#start);}
    get end() {
        if(!this.#end)
            return null;

        return new Date(this.#end);
    }

    stop() {
        if(this.#end)
            return;
        
        this.#end = truncateMilliseconds(new Date());
    }

    valueOf() {
        const end = this.#end ?? truncateMilliseconds(new Date());
        return Math.floor((end.getTime() - this.#start.getTime()) / 1000);
    }

    toString() {
        return secondsAsTimeString(this.valueOf());
    }

    toJSON() {
        return {start: this.#start.getTime(), end: this.#end?.getTime()};
    }
}

class TimeSpanCollection {
    #timeSpans = [];
    #sum = 0;

    constructor(arr = null) {
        if(arr)
            this.#timeSpans = arr.map(item => new TimeSpan(item.start, item.end));

        this.#sum = this.#timeSpans.reduce((sum, current) => sum + current, 0);
    }

    get isActive() {return this.#timeSpans.length && !this.#timeSpans[0].end;}
    
    get topValue() {
        if(!this.#timeSpans.length)
            return new TimeSpan(zeroDate, zeroDate);

        return new TimeSpan(this.#timeSpans[0].start, this.#timeSpans[0].end);
    }

    *getTimeSpans() {
        for(const timespan of this.#timeSpans)
            yield timespan;
    }

    startNew() {
        this.#timeSpans.unshift(new TimeSpan());
    }

    stop() {
        if(!this.#timeSpans.length)
            return;

        this.#timeSpans[0].stop();
        this.#sum += this.#timeSpans[0];
    }

    valueOf() {
        if(!this.#timeSpans.length)
            return 0;

        if(this.#timeSpans[0].end)
            return this.#sum;

        return this.#sum + this.#timeSpans[0];
    }

    toString() {
        return secondsAsTimeString(this);
    }

    toJSON() {
        return this.#timeSpans;
    }
}

export {TimeSpan, TimeSpanCollection, secondsAsTimeString};