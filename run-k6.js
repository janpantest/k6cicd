// run-k6.js
require('dotenv').config(); // Load environment variables from .env file
const { execSync } = require('child_process');
// const execSync = require('child_process').execSync;
// const crossEnv = require('cross-env');

// Retrieve values from .env file
// const BASE_URL = process.env.BASE_URL_BOOK;
// const TEST_NAME = process.env.TEST_NAME;
// const PASSWORD = process.env.PASSWORD;

// Log to confirm values are loaded
// console.log('Base URL:', BASE_URL);
// console.log('Username:', TEST_NAME);
// console.log('Password:', PASSWORD);

// Run k6 test with environment variables
execSync(`npx cross-env BASE_URL=${BASE_URL} USERNAME=${TEST_NAME} PASSWORD=${PASSWORD} k6 run test/api-chained.js`, { stdio: 'inherit' });
