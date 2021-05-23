const express = require('express');
const bodyParser = require('body-parser');

const cors=require('cors')
const router=require('./router')

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cors())
app.use('/api',router)

app.listen(8084, () => console.log(`Started server at http://localhost:8084!`));