class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        if (typeof Module === 'undefined') {
            console.error("WASM Module missing. Check GitHub filenames.");
            return;
        }
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };
        
        // This is the "Edge Impulse" secret sauce: 
        // Converting raw pixels into a signal the brain can read
        let res = Module.run_classifier(pixels, false);
        
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), 
                value: c.value
            }))
        };
    }
}
