'use strict';

const assert = require('assert');
let supertest = require('supertest');
let server = supertest.agent('http://localhost:3000');

describe('Test Login', function() {
  it('login success', function(done) {
    server
      .post('/api/login')
      .send({'username': 'gg001@gmail.com', 'password': '123456'})
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.token, '59db39e3fd99722beceb29cczxcvzxcv');
        done();
      });
  });
  it('email || password not match', function(done) {
    server
      .post('/api/login')
      .send({'username': 'gg001@gmail.com', 'password': '12345678'})
      .expect('Content-type', /json/)
      .expect(403)
      .end(function(err, res) {
        assert.equal(res.status, 403);
        assert.equal(res.body.error, 'password or username not match');
        done();
      });
  });
  it('email || password miss field', function(done) {
    server
      .post('/api/login')
      .send({'username': 'gg001@gmail.com'})
      .expect('Content-type', /json/)
      .expect(400)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'missing field');
        done();
      });
  });
  it('format wrong: email', function(done) {
    server
      .post('/api/login')
      .send({'username': 'gg001gmail.com'})
      .expect('Content-type', /json/)
      .expect(400)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'email format error');
        done();
      });
  });
  it('format wrong: password', function(done) {
    server
      .post('/api/login')
      .send({'username': 'gg001@gmail.com', 'password': '1234 '})
      .expect('Content-type', /json/)
      .expect(400)
      .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error,
          'password format error(with space or less than 6 charaters)');
        done();
      });
  });
});
