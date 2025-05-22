# K6 Performance Testing Framework

This repository contains performance tests for our finance module using K6. The tests are organized into three categories:
- Customer APIs
- Seller APIs
- Internal User APIs

## Prerequisites

- Windows 10 or later
- PowerShell or Command Prompt
- Administrator privileges (for installation)

## Installation

### Windows Installation

1. **Using Chocolatey (Recommended)**
   ```powershell
   # Install Chocolatey first if you don't have it
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

   # Install K6
   choco install k6
   ```

2. **Manual Installation**
   - Download the latest K6 release from [K6 Releases](https://github.com/grafana/k6/releases)
   - Extract the zip file
   - Add the extracted folder to your system's PATH environment variable

### Verify Installation
```powershell
k6 version
```

## Project Structure

```
script/
├── utils/
│   └── common.js         # Common utilities and configurations
├── customer/
│   └── customer-api.js   # Customer API tests
├── seller/
│   └── seller-api.js     # Seller API tests
└── internal/
    └── internal-api.js   # Internal user API tests
```

## Running Tests

### Basic Test Execution

1. **Run Customer API Tests**
   ```powershell
   k6 run script/customer/customer-api.js
   ```

2. **Run Seller API Tests**
   ```powershell
   k6 run script/seller/seller-api.js
   ```

3. **Run Internal API Tests**
   ```powershell
   k6 run script/internal/internal-api.js
   ```

### Advanced Test Execution

1. **Run with Environment Variables**
   ```powershell
   k6 run -e BASE_URL=http://your-environment-url/x-finance/api script/internal/internal-api.js
   ```

2. **Run with Output Options**
   ```powershell
   # Output to JSON file
   k6 run --out json=results.json script/internal/internal-api.js

   # Output to InfluxDB
   k6 run --out influxdb=http://localhost:8086/k6 script/internal/internal-api.js
   ```

3. **Run with Custom Duration**
   ```powershell
   k6 run --duration 5m script/internal/internal-api.js
   ```

## Test Configuration

Each test file contains its own configuration in the `options` object:

```javascript
export const options = {
  scenarios: {
    internal_api: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },  // Ramp up to 20 users
        { duration: '5m', target: 20 },  // Stay at 20 users
        { duration: '2m', target: 0 },   // Ramp down to 0 users
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};
```

## Understanding Test Results

K6 provides several metrics in its output:

- **http_req_duration**: Request duration
- **http_req_failed**: Failed requests
- **vus**: Virtual users
- **iterations**: Number of test iterations
- **data_received**: Amount of data received
- **data_sent**: Amount of data sent

## Best Practices

1. **Start Small**: Begin with a small number of VUs and gradually increase
2. **Monitor Resources**: Keep an eye on system resources during tests
3. **Use Thresholds**: Set appropriate thresholds for your application
4. **Random Sleep**: Include random sleep between requests to simulate real user behavior
5. **Environment Variables**: Use environment variables for different environments

## Troubleshooting

1. **Installation Issues**
   - Ensure you have administrator privileges
   - Check if the PATH environment variable is set correctly
   - Try running `k6 version` to verify installation

2. **Test Execution Issues**
   - Check if the target API is accessible
   - Verify environment variables are set correctly
   - Ensure you have proper permissions to access the API

## Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [K6 GitHub Repository](https://github.com/grafana/k6)
- [K6 Cloud](https://k6.io/cloud)

## Support

For any issues or questions, please contact the development team or create an issue in this repository.
