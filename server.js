const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const students = require('./students');

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Test Express';
app.locals.students = students

app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

app.get('/api/v1/students', (request, response) => {
  response.status(200).json(app.locals.students)
})

app.post('/api/v1/students', (request, response) => {
  const student = request.body
  let missingProperties = []

  for(let requiredProperty of ['lastname', 'program', 'enrolled']) {
    if(student[requiredProperty] === undefined) {
      missingProperties = [...missingProperties, requiredProperty]
    }
  }

  if(missingProperties.length) {
    response.status(422).send({ message: `Missing ${missingProperties} in request` })
  } else {
    app.locals.students = [...app.locals.students, student]
    response.status(201).json({ message: `Student added` })
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on localhost:${app.get('port')}.`);
});

module.exports = app;
