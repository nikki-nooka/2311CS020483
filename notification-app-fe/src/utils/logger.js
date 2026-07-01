import { Log } from 'campus-logging-middleware';

export { Log };

export const fetchWithLogging = async (url, options = {}) => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    
    if (!response.ok) {
      Log('frontend', 'error', 'api', `API Error on ${url} - Status: ${response.status}`);
    } else {
      Log('frontend', 'info', 'api', `Successfully fetched ${url} in ${Math.round(endTime - startTime)}ms`);
    }
    
    return response;
  } catch (error) {
    Log('frontend', 'error', 'api', `Fetch failed for ${url}: ${error.message}`);
    throw error;
  }
};
