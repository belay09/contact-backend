import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import adminRouter from  './routes/adminRouter.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname,join } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { GraphQLClient } from 'graphql-request';

dotenv.config();
const app = express();
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "100mb" }));app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT;

app.listen(port, ()=> {
  console.log(`Server is listening on port:${port}`);
})
