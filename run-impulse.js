class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        if (typeof Module === 'undefined') {
            console.error("WASM Module missing. Check filenames on GitHub.");
            return;
        }

        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
        console.log("AI Engine: Ready");
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };

        // Core call to the Edge Impulse WASM engine
        let res = Module.run_classifier(pixels, false);
        
        // Map results to your ALL-CAPS labels from the matrix
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), 
                value: c.value
            }))
        };
    }
}
