export function handleError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    throw error; // Rethrow if you want to propagate the error
}
