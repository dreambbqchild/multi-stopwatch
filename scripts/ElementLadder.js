class ElementSplitter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="splitter-top"></div>
        <div class="splitter-bottom"></div>`;
    }
}

customElements.define('element-splitter', ElementSplitter);

class ElementLadder extends HTMLElement {
    #children = {};
    
    get children() { return [...this.#children]; }

    add(element) {
        const splitter = document.createElement('element-splitter');
        this.appendChild(splitter);

        splitter.insertBefore(element, splitter.firstChild);

        this.#children[element] = splitter;
    }

    remove(element) {

    }    
}

customElements.define('element-ladder', ElementLadder);