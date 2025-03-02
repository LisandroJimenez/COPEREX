'use strict';
import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validate-cant-request.js';
import authRoutes from "../src/auth/auth.routes.js";
import enterpriseRoutes from "../src/enterprises/enterprise.routes.js"
import reportRoutes from "../src/reports/report.routes.js"
import { createAdmin } from '../src/auth/auth.controller.js'


const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/coperex/v1/auth', authRoutes);
    app.use('/coperex/v1/enterprises', enterpriseRoutes);
    app.use('/coperex/v1/report', reportRoutes)
}

const conectarDB = async() =>{
    
    try {
        await dbConnection();
        console.log('Successful connection to the database')
    } catch (error) {
        console.log('Failed to connect to database')
    }
}


export const initServer = async() =>{
    const app = express();
    const port = process.env.PORT || 3000;
    try {
     middlewares(app);
     conectarDB();
     await createAdmin()
     routes(app);
     app.listen(port);
     console.log(`server running on port ${port}`)
    
 } catch (err) {
    console.log(`server init failed: ${err}`)
 }

}