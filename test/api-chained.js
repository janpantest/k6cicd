import http, { expectedStatuses } from 'k6/http';
import { sleep } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { config } from '../config/config.js'
import { payloadCreateUser } from '../payloads/payloadCreateUser.js';
import { payloadAddBook } from '../payloads/payloadAddBook.js';
import { addBook, createUser, tokenCreation } from '../constants/keys.js';
import { checkAllKeysExist } from '../helpers/expects.js';
import { options } from '../options.js';

export { options }
  
export default function() {
  const userName = __ENV.TEST_NAME + Date.now();
  const password = __ENV.PASSWORD;

  let userId;
  let res;
  let token;

  describe('Create user', () => {
    res = http.post(`${config.baseUrl}/Account/v1/User`, JSON.stringify(payloadCreateUser(userName, password)), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(res.status, 'response status create user').to.equal(201);
    console.info('status create user', res.status)
    userId = JSON.parse(res.body).userID;

    checkAllKeysExist(JSON.parse(res.body), createUser);

    sleep(1);
  });

  describe('Generate token', () => {
    res = http.post(`${config.baseUrl}/Account/v1/GenerateToken`, JSON.stringify(payloadCreateUser(userName, password)), {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status, 'response status generate token').to.equal(200);
    token = JSON.parse(res.body).token;
    checkAllKeysExist(JSON.parse(res.body), tokenCreation);

    sleep(1);
  });

  describe('Add book', () => {
    res = http.post(`${config.baseUrl}/BookStore/v1/Books`, 
      JSON.stringify(payloadAddBook(userId)), {
        
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
    });

    expect(res.status, 'response status for add book').to.equal(201);
    checkAllKeysExist(JSON.parse(res.body), addBook);

    sleep(1);
  });
}

