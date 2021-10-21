import express from "express";
import { APP_PORT } from "./config";
import routers from './routes';
import './config/databaseConfig.js';
import errorHandler from "./middlewares/errorHandler";
import path from 'path';




const app=express();

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api-admin',routers);

app.use('/uploads',express.static('uploads'));



app.use(errorHandler)
app.listen(APP_PORT,()=>console.log(`'server runing..on port ${APP_PORT}`));