import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import { handleError } from './src/service/asyncHandler.js';
import cors from 'cors';
import connectDB from "./DB/DBconnection.js";
import * as indexRouter from "./src/modules/index.router.js";



const app = express();


app.use(express.json());
// setup port and the baseUrl

const port = process.env.PORT
const baseUrl = process.env.BASEURL
app.use(express.static(__dirname));

//cors
app.use(cors({}))

app.get('/', (req, res) => { res.send("<h1>HELLO</h1>") })
app.use(`${baseUrl}message`, indexRouter.messageRouter)
app.use(`${baseUrl}user`, indexRouter.userRouter)
app.use(`${baseUrl}auth`, indexRouter.authRouter)
app.use('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})

app.use(handleError)

connectDB()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
