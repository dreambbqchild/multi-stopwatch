function truncateMilliseconds() {
    return new Date(parseInt(this.getTime() * 0.001) * 1000);
}

function toDateTimeLocalMilliseconds() {
    return this.getTime() - this.getTimezoneOffset() * 60000;
}

Date.prototype.truncateMilliseconds = truncateMilliseconds;
Date.prototype.toDateTimeLocalMilliseconds = toDateTimeLocalMilliseconds;