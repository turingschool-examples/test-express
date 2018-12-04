const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server.js')
const students = require('../students.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('Server file', () => {
  describe('/api/v1/students', () => {
    beforeEach((done) => {
      app.locals.students = students
      done()
    })

    it('should return a 200 status', (done) => {
      chai.request(app)
        .get('/api/v1/students')
        .end((error, response) => {
          expect(response).to.have.status(200)
          done()
        })
    })

    it('should add a new student', (done) => {
      const newStudent = {
        lastname: 'Mitchell',
        program: 'BE',
        enrolled: false
      }

      chai.request(app)
        .post('/api/v1/students')
        .send(newStudent)
        .end((error, response) => {
          expect(response).to.have.status(201)
          expect(app.locals.students.length).to.equal(4)
          done()
        })
    })

    it('should add another new student', (done) => {
      const newStudent = {
        lastname: 'Mitchell',
        program: 'BE',
        enrolled: false
      }

      chai.request(app)
        .post('/api/v1/students')
        .send(newStudent)
        .end((error, response) => {
          expect(response).to.have.status(201)
          expect(app.locals.students.length).to.equal(4)
          done()
        })
    })

    it('should return 422 if new student is incomplete', (done) => {
      const newStudent = {
        program: 'FE',
        enrolled: true,
      }

      chai.request(app)
        .post('/api/v1/students')
        .send(newStudent)
        .end((error, response) => {
          expect(response).to.have.status(422)
          done()
        })
    })

    // Add another test checking that the payload
    // has necessary pieces, otherwise 422
    //
    // Make the test pass
  })
})
