class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        if (typeof Module === 'undefined') {
            throw new Error('Module is not defined. Check if edge-impulse-standalone.js is loaded.');
        }
        
        // Wait for WebAssembly to be ready
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
    }

    async classify(pixels) {
        if (!this._initialized) throw new Error('Classifier not initialized');

        // Create a buffer in WASM memory for the pixel data
        const obj = {
            device_type: "browser",
            video: false
        };

        // Prepare the features array for the WASM engine
        let res = Module.run_classifier(pixels, false);
        
        // Ensure the results match the classification format
        return {
            results: res.classification.map(c => ({
                label: c.label,
                value: c.value
            }))
        };
    }
}
