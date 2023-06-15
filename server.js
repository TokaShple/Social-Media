import express from "express";
import bodyParser from "body-parser";
import { connection } from "./database/connection.js";
import morgan from "morgan";
import * as dotenv from 'dotenv';
import { init } from "./src/modules/index.js";
import cors from "cors";

dotenv.config();
connection();
const app = express();
app.use(bodyParser.json());
init(app);
const port = 3000;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
process.on('unhandledRejection',(err)=>{
    console.log(err);
})
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!` ));
