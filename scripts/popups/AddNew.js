import StopwatchService from "../services/StopwatchService.js";

class AddNew extends HTMLElement {
    #input = null;
    onOk() {
        StopwatchService.newStopwatch(this.#input.value);
    }

    connectedCallback() {
        this.innerHTML = `<label class="padding-right-1em">Label:</label><input type="text"></input>`;
        this.#input = this.querySelector('input');
    }
}

customElements.define('add-new', AddNew);