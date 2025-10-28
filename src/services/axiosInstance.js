import config from '../config/config.js';

export const axiosInstance = async (endpoint) => {
  try {
    const url = config.baseurl + endpoint;
    console.log(`Fetching: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      headers: {
        ...(config.headers || {}),
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log(`Received data length: ${data.length}`);
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error.message);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout - the external API took too long to respond',
      };
    }
    
    return {
      success: false,
      message: error.message,
    };
  }
};
