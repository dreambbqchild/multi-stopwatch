export default class ElementFactory {
    static createElement(name, options) {
        const element = document.createElement(name);
        Object.assign(element, options);
        return element;
    }

    static appendChildrenTo(element, ...elements) {
        for(const e of elements)
            element.appendChild(e);
    }
}