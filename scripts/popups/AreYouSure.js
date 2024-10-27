import StopwatchService from "../services/StopwatchService.js";

class AreYouSure extends HTMLElement {
    #input = null;
    onOk() {
        StopwatchService.resetAll();
    }

    connectedCallback() {
        this.innerHTML = `Are you sure you want to reset all the stopwatches?`
    }
}

customElements.define('are-you-sure', AreYouSure);