import type { TaxonomyData, TaxonomyItem } from './types';

interface AppConfig {
    apiUrl: string;
    apiKey: string;
}

/**
 * Performs a JSONP request to a specified URL. This is a workaround for CORS issues.
 * @param url The full URL for the JSONP request, including the callback parameter.
 * @returns A promise that resolves with the data from the JSONP response.
 */
function jsonp(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');

    const cleanup = () => {
      delete (window as any)[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed. Check browser console for details.'));
    };
    
    script.src = `${url}&callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

/**
 * Gets the configuration values intended for display in the UI.
 * It prioritizes user-saved values from localStorage over defaults from config.js.
 */
export const getDisplayConfig = (): { apiUrl: string, apiKey: string } => {
    const defaultConfigUrl = (window as any).APP_CONFIG?.API_URL || '';
    const userUrl = localStorage.getItem('API_URL');
    const userKey = localStorage.getItem('API_KEY') || '';

    return {
        apiUrl: userUrl || defaultConfigUrl,
        apiKey: userKey,
    };
};


const getApiConfig = (): AppConfig => {
    const { apiUrl, apiKey } = getDisplayConfig();
    if (!apiUrl || !apiKey) {
        throw new Error("API_CONFIG_MISSING");
    }
    return { apiUrl, apiKey };
}

/**
 * Fetches the entire taxonomy data from the backend using the JSONP method.
 */
export const fetchTaxonomyViaJsonp = async (): Promise<TaxonomyData> => {
    const { apiUrl, apiKey } = getApiConfig();
    const url = `${apiUrl}?key=${apiKey}`;
    const response = await jsonp(url);
    if (response.error) {
        throw new Error(response.error);
    }
    
    const allItems: TaxonomyItem[] = response.items || [];
    const groupedData: TaxonomyData = {};

    allItems.forEach(item => {
        if (!groupedData[item.category]) {
            groupedData[item.category] = [];
        }
        // Ensure tags are always an array
        const tagsArray = typeof item.tags === 'string' && item.tags ? item.tags.split('|') : [];
        groupedData[item.category].push({ ...item, tags: tagsArray });
    });

    return groupedData;
};

/**
 * Saves the entire taxonomy data to the backend using a POST request.
 * @param data The complete TaxonomyData object to save.
 */
const flattenTaxonomy = (data: TaxonomyData): TaxonomyItem[] => {
    const items: TaxonomyItem[] = [];
    Object.keys(data).forEach(category => {
        (data[category] || []).forEach(item => {
            items.push({
                ...item,
                // Convert tag arrays back into the pipe-separated string format expected by the sheet.
                tags: Array.isArray(item.tags) ? item.tags.join('|') : (item.tags || ''),
            });
        });
    });
    return items;
};

export const saveTaxonomyData = async (data: TaxonomyData): Promise<{ success: boolean }> => {
    const { apiUrl, apiKey } = getApiConfig();
    const url = `${apiUrl}?key=${apiKey}`;

    const items = flattenTaxonomy(data);
    const body = new URLSearchParams();
    body.set('action', 'saveTaxonomy');
    body.set('items', JSON.stringify(items));

    let response: Response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: body.toString(),
        });
    } catch (err) {
        if (err instanceof TypeError) {
            throw new Error('Network request failed. This usually means the Apps Script deployment is missing CORS headers.');
        }
        throw err;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};
