import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

/**
 * Checks if the given key exists in the response body.
 * @param {Object} response - The response object (typically `response.json()`).
 * @param {string} key - The key to check for existence in the response.
 */
export function checkKeyExists(response, key) {
  expect(response, 'Specific key').to.have.property(key);
}

/**
 * Checks if multiple keys exist in the response object.
 * @param {Object} response - The response object (typically `response.json()`).
 * @param {Array} keys - An array of keys to check for existence in the response.
 */
export function checkAllKeysExist(response, keys) {
    keys.forEach(key => {
        expect(response, 'All keys').to.have.property(key);
    })
}

/**
 * Checks status code value against expected value
 * @param {number} statusCode Status code received from response
 * @param {number} expectedStatusCode Expected status code based on tester input
 * @param {string} extraIdentifier Extra identifier in case it is needed. Default is empty string
 */
export function checkForStatusCode(statusCode, expectedStatusCode, extraIdentifier = null) {
  expect(statusCode, `Status code ${extraIdentifier ? `${extraIdentifier} ` : ''}should be`).to.equal(expectedStatusCode);
}

/**
 * Checks status code value against expected value
 * @param {Object} response - The response object (typically `response.json()`).
 * @param {number} expectedStatusCode Expected status code based on tester input
 */
export function checkResponseStatusCode(response, expectedStatusCode) {
  expect(response, 'Response status code should be').to.equal(expectedStatusCode);
}
