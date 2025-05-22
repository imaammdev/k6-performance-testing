import http from 'k6/http';
import { checkResponse, makeApiCall, API_TYPES, getHeaders } from '../utils/common.js';
import { SERVICES } from '../utils/services.js';
import { check } from 'k6';

export const options = {
  scenarios: {
    customer_api: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 },  // Ramp up to 10 users
        { duration: '30s', target: 100 },  // Stay at 10 users
        { duration: '30s', target: 0 },   // Ramp down to 0 users
      ],
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'] // 95% of requests should be below 500ms
  }
};

export default function () {
  const apiparams = {
    orderId: '27008569928'
  };
  
  const response = makeApiCall('FINANCE', 'ORDERDETAIL', apiparams, {
    apiType: API_TYPES.EAG
  });
  checkResponse(response, 'Get tax invoice order detail');


  const responsetax = makeApiCall('FINANCE', 'GETTAXINVOICE', apiparams, {
    apiType: API_TYPES.EAG
  });
  checkResponse(responsetax, 'Get tax information based on order id');

  
} 
