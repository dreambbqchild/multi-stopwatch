import StorageService from "../services/StorageService.js";

class AddNew extends HTMLElement {
    #input = null;

    onOk() {
        const kvp = {key: this.#input.value, value: []};
        StorageService.save(kvp);
        document.querySelector('main-element').newStopwatch(kvp);
    }

    connectedCallback(){
        this.innerHTML = `<label class="padding-right-1em">Label:</label><input type="text"></input>`;

        this.#input = this.querySelector('input');
        setTimeout(() => this.#input.focus(), 0);
    }
}

customElements.define('add-new', AddNew);