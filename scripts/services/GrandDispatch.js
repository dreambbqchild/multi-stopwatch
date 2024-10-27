export default class GrandDispatch {
    static addEventListener(name, callback) {
        document.body.addEventListener(name, callback);
    }

    static dispatchEvent(name, detail) {
        document.body.dispatchEvent(new CustomEvent(name, {detail}));
    }
}