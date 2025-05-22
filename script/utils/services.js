// Service configurations
export const SERVICES = {
  FINANCE: {
    name: 'servicex',
    baseUrl: 'http://lorem.ipsum',
    endpoints: {
      SETTLEMENT: {
        path: '/apix/settlement',
        method: 'GET',
        type: 'DEFAULT',
        requiredParams: ['channelId', 'clientId', 'orderItemId', 'requestId', 'storeId', 'username']
      },
      ORDERDETAIL: {
        path: '/tax-invoice/order-detail',
        method: 'GET',
        type: 'EAG',
        requiredParams: ['orderId']
      },
      GETTAXINVOICE: {
        path: '/tax-invoice/tax-information',
        method: 'GET',
        type: 'EAG',
        requiredParams: ['orderId']
      }
      // Add more endpoints here
    }
  },
  LOGISTIC: {
    name: 'servicez',
    baseUrl: 'http://ipsum.lorem',
    endpoints: {
      ORDER_DETAIL: {
        path: '/order/detail',
        method: 'GET',
        type: 'DEFAULT',
        requiredParams: ['orderId']
      }
      // Add more order endpoints here
    }
  }
  // Add more services here
};
