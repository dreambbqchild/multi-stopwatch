export default class ElementFactory {
    static createElement(name, options) {
        const element = document.createElement(name);
        Object.assign(element, options);
        return element;
    }

    static appendElementsTo(element, elements) {
        if(elements.constructor === Function)
            elements = elements.valueOf();

        for(const e of elements)
            element.appendChild(e);

        return elements;
    }

    static beginCreateElements() {
        const elements = [];
        const result = (name, options) => {
            elements.push(ElementFactory.createElement(name, options));
            return result;
        };
        result.valueOf = () => elements;
        return result;
    }
}