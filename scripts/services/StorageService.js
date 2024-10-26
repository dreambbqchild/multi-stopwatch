const prefix = 'multi-stopwatch-';

export default class StorageService {
    static save(kvp) {
        localStorage.setItem(`${prefix}${kvp.key}`, JSON.stringify(kvp.value));
    }

    static *load() {
        for(const [key, value] of Object.entries(localStorage)) {
            if(key.startsWith(prefix))
                yield { key: key.substring(prefix.length), value: JSON.parse(value) }; 
        }
    }

    static clear() {
        for(const key of [...Object.keys(localStorage)]) {
            if(key.startsWith(prefix))
                localStorage.removeItem(key);
        }
    }
}