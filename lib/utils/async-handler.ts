import { Dispatch, SetStateAction } from 'react';

export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<Error | null>>
): Promise<T> {
  setIsLoading(true);
  setError(null);
  try {
    const result = await operation();
    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    setError(error);
    throw error;
  } finally {
    setIsLoading(false);
  }
}
