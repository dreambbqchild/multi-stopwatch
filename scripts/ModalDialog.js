class ModalDialog extends HTMLElement {
    #modalOverlay = null;
    #modalContent = null;
    #title = null;

    #cmdOk = null;
    #cmdCancel = null;

    open(title, popupElementName) {
        const child = document.createElement(popupElementName);
        if(this.#modalContent.firstChild)
            this.#modalContent.removeChild(this.#modalContent.firstChild);

        for(const input of document.querySelector('.root').querySelectorAll('button, a'))
            input.setAttribute('inert', true);

        this.#title.textContent = title;
        this.#modalContent.appendChild(child);
        this.#modalOverlay.classList.add('show');

        document.body.style.overflow = 'hidden';

        const input = child.querySelector('input');
        if(input)
            setTimeout(() => {input.focus(); input.select();}, 0);

        return child;
    }

    #close() {
        this.#modalOverlay.classList.remove('show');

        for(const input of document.querySelector('.root').querySelectorAll('button, a'))
            input.removeAttribute('inert');

        document.body.style.overflow = null;
    }

    connectedCallback() {
        this.innerHTML = `<div class="overlay">
            <div class="modal">
                <span>Title</span>
                <hr/>
                <div class="modal-content"></div>
                <div class="flex">
                    <button type="button" class="w-50 margin-1em bg-green">Ok</button>
                    <button type="button" class="w-50 margin-1em bg-red">Cancel</button>
                </div>
            </div>
        </div>`;

        this.#modalOverlay = this.querySelector('.overlay');
        this.#title = this.querySelector('span');
        this.#modalContent = this.querySelector('.modal-content');

        this.#cmdOk = this.querySelector('.bg-green');
        this.#cmdCancel = this.querySelector('.bg-red');

        this.#cmdOk.addEventListener('click', () => {
            if(this.#modalContent.firstChild.onOk)
                this.#modalContent.firstChild.onOk();

            this.#close();
        });
        
        this.#cmdCancel.addEventListener('click', () => this.#close());
    }
}

customElements.define("modal-dialog", ModalDialog);