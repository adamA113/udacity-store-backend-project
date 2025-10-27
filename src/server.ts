import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/index';

const app: express.Application = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;