const request = require('supertest');
const app = require('../index');

const postJsonData = {
	"time": 1591653365000,
	"message": "Please register this message"
};

describe('POST /echoAtTime', () => {
    it('respond with json containing a status success and message', (done) => {
        request(app)
            .post('/echoAtTime')
            .send(postJsonData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                status: 'success',
                message: 'message has been registered successfully'
            }, done);

    });
});
