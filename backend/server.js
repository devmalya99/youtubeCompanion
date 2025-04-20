import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import youtubeRoutes from './routes/youtubeRoutes.js';
import noteRoutes from './routes/youtubeRoutes.js';
import eventLogRoutes from './routes/youtubeRoutes.js';
import authRoutes from './routes/authRoute.js'
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173', // Specify your frontend origin
    credentials: true, // Allow credentials
  };
  
app.use(cors(corsOptions))
app.use(express.json());

// Routes
app.use('/api/youtube', youtubeRoutes);

app.use('/api/notes', noteRoutes);
app.use('/api/event-logs', eventLogRoutes);

app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








