import express from 'express';
import cors from 'cors';
const app = express();

app.locals.title = 'Test Express';
app.use(cors());
app.use(express.json());

// All endpoints live here

app.get('/', (request, response) => {
  response.send('We\'re going to test all the routes!');
});

export default app;