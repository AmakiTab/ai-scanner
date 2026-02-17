class EdgeImpulseClassifier {
    constructor() {
        this._initialized = false;
    }

    async init() {
        // Checks if the 'brain' file is loaded in the browser
        if (typeof Module === 'undefined') {
            console.error("WASM Module not found. Check if edge-impulse-standalone.js is uploaded.");
            return;
        }

        // Wait for the heavy .wasm file to finish compiling
        if (Module.runtimeInitialized) {
            this._initialized = true;
        } else {
            await new Promise(resolve => Module.onRuntimeInitialized = resolve);
            this._initialized = true;
        }
        console.log("AI Brain: Fully Initialized");
    }

    async classify(pixels) {
        if (!this._initialized) return { results: [] };

        // This runs the actual AI calculation
        let res = Module.run_classifier(pixels, false);
        
        // Return results as ALL-CAPS to match your training labels
        return {
            results: res.classification.map(c => ({
                label: c.label.toUpperCase(), 
                value: c.value
            }))
        };
    }
}
