const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors')
const router=require('./routerForRedis')

const app = express();
app.use(bodyParser.json()); 
app.use(cors())
app.use('/api',router)

app.listen(8081, () => console.log(`Started server at http://localhost:8081!`));