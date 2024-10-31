const dispatch = document.createElement('div');

export default class GrandDispatch {
    static addEventListener(name, callback) {
        dispatch.addEventListener(name, callback);
    }

    static dispatchEvent(name, detail) {
        dispatch.dispatchEvent(new CustomEvent(name, {detail}));
    }
}