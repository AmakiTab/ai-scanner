class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        // This checks if the WebAssembly module is actually loaded in memory
        if (typeof Module === 'undefined') {
            console.error("WASM Module missing. Check your script tags.");
            return;
        }

        // Wait for the WASM runtime to be fully initialized
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
        console.log("AI Brain status: 100% Ready");
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };

        // Core call to the Edge Impulse WASM engine
        let res = Module.run_classifier(pixels, false);
        
        // Map the internal results to your Classification labels
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), // Ensures match with our logic
                value: c.value
            }))
        };
    }
}
