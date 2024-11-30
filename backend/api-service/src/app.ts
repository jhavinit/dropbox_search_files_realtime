import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import searchRoutes from './routes/search.routes';
import { PORT } from './constants/app.constants';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});