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
        console.log("AI Engine: Ready");
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };

        // Run the 160x160 classification engine
        let res = Module.run_classifier(pixels, false);
        
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), 
                value: c.value
            }))
        };
    }
}
