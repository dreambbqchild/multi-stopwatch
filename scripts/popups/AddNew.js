import { TimeSpanCollection } from "../models/TimeSpan.js";
import StorageService from "../services/StorageService.js";

class AddNew extends HTMLElement {
    #input = null;

    onOk() {
        StorageService.save({key: this.#input.value, value: new TimeSpanCollection()})      
    }

    connectedCallback(){
        this.innerHTML = `<label class="padding-right-1em">Label:</label><input type="text"></input>`;

        this.#input = this.querySelector('input');
        setTimeout(() => this.#input.focus(), 0);
    }
}

customElements.define('add-new', AddNew);