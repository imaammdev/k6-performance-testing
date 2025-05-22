import { check } from 'k6';
import http from 'k6/http';
import { SERVICES } from './services.js';

export const API_TYPES = {
  DOWNLOAD: 'download',
  IAG: 'iag',
  EAG: 'eag',
  DEFAULT: 'default'
};

export const getHeaders = (apiType, additionalHeaders = {}) => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  switch (apiType) {
    case API_TYPES.DOWNLOAD:
      return {
        ...baseHeaders,
        'Accept': 'application/octet-stream',
        'Content-Disposition': 'attachment',
        ...additionalHeaders
      };

    case API_TYPES.IAG:
      return {
        ...baseHeaders,
        'header1': 'k6-performance-test',
        'header2': 'k6-tester',
        'header3': 'it-admin',
        ...additionalHeaders
      };

    case API_TYPES.EAG:
      return {
        ...baseHeaders,
        'header1': 'k6-performance-test',
        'header2': 'k6-tester',
        'header3': 'it-admin',
        ...additionalHeaders
      };

    case API_TYPES.DEFAULT:
    default:
      return {
        ...baseHeaders,
        ...additionalHeaders
      };
  }
};


export const checkResponse = (response, name) => {
  check(response, {
    [`${name} status is 200`]: (r) => r.status === 200,
    [`${name} response time < 500ms`]: (r) => r.timings.duration < 500,
  });
};


export const getEndpointType = (service, endpoint) => {
  return SERVICES[service]?.endpoints[endpoint]?.type || 'DEFAULT';
};

export const buildUrl = (service, endpoint, params = {}) => {
  const serviceConfig = SERVICES[service];
  const endpointConfig = serviceConfig.endpoints[endpoint];
  
  if (!serviceConfig || !endpointConfig) {
    throw new Error(`Service or endpoint not found: ${service}.${endpoint}`);
  }

  const missingParams = endpointConfig.requiredParams.filter(param => !params[param]);
  if (missingParams.length > 0) {
    throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${serviceConfig.baseUrl}${endpointConfig.path}${queryString ? '?' + queryString : ''}`;
};


export const makeApiCall = (service, endpoint, params = {}, options = {}) => {
  const url = buildUrl(service, endpoint, params);
  const apiType = options.apiType || getEndpointType(service, endpoint);
  const headers = getHeaders(apiType, options.additionalHeaders || {});

  return http.get(url, { headers });
}; 
