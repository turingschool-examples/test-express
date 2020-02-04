import express from 'express';
import cors from 'cors';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const app = express();

app.locals.title = 'Test Express';
app.locals.id = 0;
app.use(cors());
app.use(express.json());

// All endpoints live here

app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

app.get('/api/v1/students', async (request, response) => {
  try {
    const students = await database('students').select();
    response.status(200).json(students);
  } catch (error) {
    response.status(500).json({error})
  }
});

app.get('/api/v1/students/:id', async(request, response) => {
  const { id } = request.params;

  try {
    const student = await database('students').where('id', id);

    if (student.length) {
      response.status(200).json(student)
    } else {
      response.status(404).json({error: 'Student not found'})
    }
  } catch (err) {
    response.status(500).json({error})
  }
});


app.post('/api/v1/students', async (request, response) => {
  const student = request.body;

  for (let requiredParameter of ['lastname', 'program', 'enrolled']) {
    if (!student.hasOwnProperty(requiredParameter)) {
      return response
        .status(422)
        .send({ error: `The expected format is: { lastname: <String>, program: <String>, enrolled: <Boolean   > }. You're missing a "${requiredParameter}" property.`})
    }
  }

  try {
    const id = await database('students').insert(student, 'id');
    response.status(201).json({id});
  } catch (error) {
    response.status(500).json({ error });
  } 
});

export default app;