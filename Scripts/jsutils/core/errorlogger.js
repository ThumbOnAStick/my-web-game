// Used when code is not implemented
export function notImplementedError(message) {
    if (typeof message === "undefined" || message === null) 
    {
        return new Error("!!!Not implemented!!!");
    }
    return new Error(`Not implemented: ${message}`);
}

export function numberMismatchError(message)
{
     if (typeof message === "undefined" || message === null) 
    {
        return new Error("!!!Number Mismatch!!!");
    }
    return new Error(`Number Mismatch: ${message}`);
}