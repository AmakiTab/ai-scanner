class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        // Wait for the WebAssembly Module to be fully ready
        if (typeof Module === 'undefined') {
            throw new Error('Module is not defined. Ensure edge-impulse-standalone.js is loaded before this script.');
        }
        
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
        console.log("AI Brain Initialized and Ready.");
    }

    async classify(pixels) {
        if (!this._initialized) throw new Error('Classifier not initialized');

        // Classification models expect a simple array of RGB values
        // Module.run_classifier is the core function in your .wasm file
        let res = Module.run_classifier(pixels, false);
        
        if (res.result !== 0) {
            console.error("Classification failed with error code:", res.result);
            return { results: [] };
        }

        // Return a clean list of labels and their confidence values
        return {
            results: res.classification.map(c => ({
                label: c.label,
                value: c.value
            }))
        };
    }

    // Helper to see model properties (like required width/height)
    getProperties() {
        return Module.get_properties();
    }
}
