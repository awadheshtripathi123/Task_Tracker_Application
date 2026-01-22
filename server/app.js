import express, { urlencoded } from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";
// Routes Import
import taskRoute from './routes/taskRoute.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();

app.use(cors({
  origin: `process.env.CORS_ORIGIN`,
  credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(urlencoded({ extended: true, limit: '16kb'}))
app.use(cookieParser());



// Routes Declaration as a Middleware
app.use('/api', taskRoute);
app.use('/api', userRoute);
app.use('/api', authRoute);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

export default app;