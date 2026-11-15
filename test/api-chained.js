import http from 'k6/http';
import { sleep } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { config } from '../config/config.js';
import { payloadCreateUser } from '../payloads/payloadCreateUser.js';
import { payloadAddBook } from '../payloads/payloadAddBook.js';
import { addBook, createUser, tokenCreation } from '../constants/keys.js';
import { checkAllKeysExist } from '../helpers/expects.js';
import { options } from '../options.js';

export { options };

export default function () {
  // Generate unique credentials for each VU and iteration
  const userName = `${__ENV.TEST_NAME}-${__VU}-${__ITER}-${Date.now()}`;
  const password = __ENV.PASSWORD;

  let userId;
  let token;
  let firstIsbnValue;
  let isbnToAdd;

  const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  };

  describe('Create user', () => {
    const res = http.post(
      `${config.baseUrl}/Account/v1/User`,
      JSON.stringify(payloadCreateUser(userName, password)),
      { headers }
    );

    expect(res.status, 'response status create user').to.equal(201);

    const responseBody = JSON.parse(res.body);
    userId = responseBody.userID;

    expect(userId, 'generated user ID').to.be.a('string').and.not.empty;
    checkAllKeysExist(responseBody, createUser);

    sleep(1);
  });

  describe('Generate token', () => {
    const res = http.post(
      `${config.baseUrl}/Account/v1/GenerateToken`,
      JSON.stringify(payloadCreateUser(userName, password)),
      { headers }
    );

    expect(res.status, 'response status generate token').to.equal(200);

    const responseBody = JSON.parse(res.body);
    token = responseBody.token;

    expect(token, 'generated token').to.be.a('string').and.not.empty;
    checkAllKeysExist(responseBody, tokenCreation);

    sleep(1);
  });

  describe('Get ISBN value from books', () => {
    const res = http.get(
      `${config.baseUrl}/BookStore/v1/Books`
    );

    expect(res.status, 'response status get books').to.equal(200);

    const responseBody = JSON.parse(res.body);

    const bookAmount = responseBody.books.length;
    expect(bookAmount, 'books list is not empty')
        .to.be.greaterThan(0);
    const randomIndex = Math.floor(Math.random() * bookAmount);
    isbnToAdd = responseBody.books[randomIndex].isbn;

    firstIsbnValue = responseBody.books[0].isbn;
    expect(firstIsbnValue, 'first book ISBN')
        .to.be.a('string')
        .and.not.empty;

    sleep(1);
  });

  describe('Add book', () => {
    const res = http.post(
      `${config.baseUrl}/BookStore/v1/Books`,
      JSON.stringify(payloadAddBook(userId, isbnToAdd)), {
        headers: {
          ...headers,
          'Authorization': `Bearer ${token}`,
        },
    });

    expect(res.status, 'response status add book').to.equal(201);

    const responseBody = JSON.parse(res.body);
    checkAllKeysExist(responseBody, addBook);

    sleep(1);
  });

  describe('Verify book in user collection', () => {
    const res = http.get(
      `${config.baseUrl}/Account/v1/User/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
    });

    expect(res.status, 'response status get user').to.equal(200);

    const responseBody = JSON.parse(res.body);
    // console.info(JSON.stringify(responseBody, null, 2));
    const bookExists = responseBody.books.some(
      book => book.isbn === isbnToAdd
    );

    expect(bookExists, 'newly added book exists in collection').to.equal(true);

    sleep(1);
  });
}
