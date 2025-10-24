import http, { expectedStatuses } from 'k6/http';
import { sleep } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { config } from '../config/config.js'
import { payloadCreateUser } from '../payloads/payloadCreateUser.js';
import { payloadAddBook } from '../payloads/payloadAddBook.js';
import { addBook, createUser, tokenCreation } from '../constants/keys.js';
import { checkAllKeysExist } from '../helpers/expects.js';

export const options = {
  vus: 1,
  duration: '1s'
}

  
export default function() {
  const userName = 'test_' + Date.now();
  const password = __ENV.PASSWORD;
  // console.log(userName + ' ' + password);
  // console.log(`Using ${userName} having this password: ${password}`);

  let userId;
  let res;
  let token;

  describe('Create user', () => {
    res = http.post(`${config.baseUrl}/Account/v1/User`, JSON.stringify(payloadCreateUser(userName, password)), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(res.status, 'response status').to.equal(202);
    userId = JSON.parse(res.body).userID;

    checkAllKeysExist(JSON.parse(res.body), createUser);
    // console.log(JSON.parse(res.body));

    sleep(1);
  });

  describe('Generate token', () => {
    // console.log(`Using user ID: ${userId} with username : ${userName}`);
    res = http.post(`${config.baseUrl}/Account/v1/GenerateToken`, JSON.stringify(payloadCreateUser(userName, password)), {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status, 'response status').to.equal(200);
    token = JSON.parse(res.body).token;
    checkAllKeysExist(JSON.parse(res.body), tokenCreation);

    // console.log(JSON.parse(res.body));

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

    expect(res.status, 'response status').to.equal(201);
    // console.log(JSON.parse(res.body));
    checkAllKeysExist(JSON.parse(res.body), addBook);

    sleep(1);
  });
}

