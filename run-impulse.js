class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        if (typeof Module === 'undefined') return;
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };
        
        // Convert the array to a format the WASM brain understands
        let res = Module.run_classifier(pixels, false);
        
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), 
                value: c.value
            }))
        };
    }
}
