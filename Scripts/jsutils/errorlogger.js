// Used when code is not implemented
export function notImplementedError(message) {
    if (typeof message === "undefined" || message === null) {
        return new Error("!!!Not implemented!!!");
    }
    return new Error(`Not implemented: ${message}`);
}
