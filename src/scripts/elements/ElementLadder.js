class ElementSplitter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="splitter-top"></div>
        <div class="splitter-bottom"></div>`;
    }
}

customElements.define('element-splitter', ElementSplitter);

class ElementLadder extends HTMLElement {
    #children = new Map();
    
    get children() { return this.#children.keys(); }

    add(element) {
        const splitter = document.createElement('element-splitter');
        this.appendChild(splitter);

        splitter.insertBefore(element, splitter.firstChild);

        this.#children.set(element, splitter);
    }

    remove(element) {
        const splitter = this.#children.get(element);
        this.removeChild(splitter);
        this.#children.delete(element);
    }    
}

customElements.define('element-ladder', ElementLadder);