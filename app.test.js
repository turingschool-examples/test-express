import "@babel/polyfill";
import request from 'supertest'
import app from './app.js'

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/students', () => {
    it('should return a 200 and all of the students', async () => {
      const expectedStudents = await database('students').select();

      const response = await request(app).get('/api/v1/students');
      const students = response.body;

      expect(response.status).toBe(200);
      expect(students).toEqual(expectedStudents);
    });
  });

  describe('GET /api/v1/students/:id', () => {
    it('should return a 200 and a single student if the student exists', async () => {
      const expectedStudent = await database('students').first();
      const { id } = expectedStudent;

      const res = await request(app).get(`/api/v1/students/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(result).toEqual(expectedStudent);
    });

    it('should return a 404 if that student does not exist in the DB', async () => {
      const invalidId = -2;

      const res = await request(app).get(`/api/v1/students/${invalidId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual('Student not found');
    });
  });

  describe('POST /api/v1/students', () => {
    it('should post a new student to the db', async () => {
      const newStudent = { lastname: 'Lovett', program: 'FE', enrolled: false };

      const res = await request(app).post('/api/v1/students').send(newStudent);

      const students = await database('students').where('id', res.body.id[0]);

      const student = students[0];

      expect(res.status).toBe(201);
      expect(student.lastname).toEqual(newStudent.lastname);
    });

    it('should return a 422 if there are missing properties from the request body', async () => {
      const newStudent = { program: 'FE', enrolled: false };

      const res = await request(app).post('/api/v1/students').send(newStudent);

      expect(res.status).toBe(422);
      expect(res.body.error).toBe('The expected format is: { lastname: <String>, program: <String>, enrolled: <Boolean   > }. You\'re missing a \"lastname\" property.')
    });
  });
});
