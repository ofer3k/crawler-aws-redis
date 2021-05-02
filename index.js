const express = require('express');
const bodyParser = require('body-parser');

const router=require('./router')

const app = express();
app.use(bodyParser.json()); 

app.use('/api',router)




app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));