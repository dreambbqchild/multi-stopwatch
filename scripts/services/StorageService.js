export default class StorageService {
    static save(kvp) {
        localStorage.setItem(kvp.key, JSON.stringify(kvp.value));
    }

    static load(key) {
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : null;
    }

    static *loadWithPrefix(prefix) {
        for(const [key, value] of Object.entries(localStorage)) {
            if(key.startsWith(prefix))
                yield { key, value: JSON.parse(value) }; 
        }
    }

    static clearWithPrefix(prefix) {
        for(const key of [...Object.keys(localStorage)]) {
            if(key.startsWith(prefix))
                localStorage.removeItem(key);
        }
    }
}