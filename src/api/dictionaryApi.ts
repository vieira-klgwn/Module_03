import axios, { AxiosError, CancelTokenSource } from 'axios';
import { DictionaryEntry } from '../types/dictionary';
import { validateDictionaryResponse } from '../utils/helpers';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const REQUEST_TIMEOUT = 10000;

let activeCancelSource: CancelTokenSource | null = null;

export function cancelActiveRequest(): void {
  if (activeCancelSource) {
    activeCancelSource.cancel('Request cancelled');
    activeCancelSource = null;
  }
}

export async function fetchWordDefinition(word: string): Promise<DictionaryEntry[]> {
  cancelActiveRequest();

  const source = axios.CancelToken.source();
  activeCancelSource = source;

  try {
    const response = await axios.get<unknown>(`${BASE_URL}/${encodeURIComponent(word)}`, {
      timeout: REQUEST_TIMEOUT,
      cancelToken: source.token,
      headers: {
        Accept: 'application/json',
      },
      validateStatus: (status) => status < 600,
    });

    if (response.status === 404) {
      const error = new AxiosError('Not Found');
      error.response = { status: 404, data: null, statusText: 'Not Found', headers: {}, config: response.config };
      throw error;
    }

    if (response.status >= 500) {
      const error = new AxiosError('Server Error');
      error.response = {
        status: response.status,
        data: response.data,
        statusText: 'Server Error',
        headers: {},
        config: response.config,
      };
      throw error;
    }

    if (typeof response.data === 'string') {
      try {
        const parsed = JSON.parse(response.data);
        return validateDictionaryResponse(parsed);
      } catch {
        throw new Error('MALFORMED_RESPONSE');
      }
    }

    if (response.data === null || response.data === undefined) {
      throw new Error('EMPTY_RESPONSE');
    }

    if (typeof response.data !== 'object') {
      throw new Error('MALFORMED_RESPONSE');
    }

    return validateDictionaryResponse(response.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    throw error;
  } finally {
    if (activeCancelSource === source) {
      activeCancelSource = null;
    }
  }
}
