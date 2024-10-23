export const GLOBAL_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";

export let GLOBAL_ERRORS: string[] = [];

export function getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
        "ERR001": "Invalid input. Please check your data.",
        "ERR002": "Resource not found.",
        "ERR003": "Operation timed out. Please try again.",
    };

    return errorMessages[errorCode] || GLOBAL_ERROR_MESSAGE;
}

export function addGlobalError(message: string | null){
    if(!GLOBAL_ERRORS.includes(message)){
        GLOBAL_ERRORS.push(message);
    }
}
export function removeGlobalError(message: string){
    if(GLOBAL_ERRORS.includes(message)){
        const filteredArray = GLOBAL_ERRORS.filter(item => item !== message);
        GLOBAL_ERRORS = filteredArray;
    }
}