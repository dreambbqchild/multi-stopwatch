class ElementLadder extends HTMLElement {
    #children = [];
    
    get children() { return [...this.#children]; }

    add(element) {
        this.#children.push(this.#children);

        const div = document.createElement('div');
        const hrTop = document.createElement('div');
        const hrBottom = document.createElement('div');
        
        div.appendChild(element);
        div.appendChild(hrTop);
        div.appendChild(hrBottom);

        hrBottom.classList.add('splitter-bottom');
        hrTop.classList.add('splitter-top');

        this.appendChild(div);
    }

    remove(element) {

    }    
}

customElements.define('element-ladder', ElementLadder);