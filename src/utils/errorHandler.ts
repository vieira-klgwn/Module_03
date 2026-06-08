import { AxiosError } from 'axios';
import { SearchError } from '../types/dictionary';

export function parseApiError(error: unknown): SearchError {
  if (!error) {
    return { message: 'An unexpected error occurred', canRetry: true };
  }

  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        message: 'Request timed out\nPlease try again',
        canRetry: true,
      };
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      if (error.message === 'Network Error') {
        return {
          message: 'No internet connection',
          canRetry: true,
        };
      }
      return {
        message: 'Connection lost',
        canRetry: true,
      };
    }

    const status = error.response.status;

    if (status === 404) {
      return { message: 'Word not found', canRetry: true };
    }

    if (status >= 500) {
      return {
        message: 'Dictionary service unavailable\nTry again later',
        canRetry: true,
      };
    }

    return { message: 'An unexpected error occurred', canRetry: true };
  }

  if (error instanceof Error) {
    if (error.message === 'EMPTY_RESPONSE') {
      return { message: 'No results found', canRetry: true };
    }
    if (error.message === 'MALFORMED_RESPONSE') {
      return { message: 'Unexpected response received', canRetry: true };
    }
    if (error.message === 'NO_INTERNET') {
      return { message: 'No internet connection', canRetry: true };
    }
  }

  return { message: 'An unexpected error occurred', canRetry: true };
}
