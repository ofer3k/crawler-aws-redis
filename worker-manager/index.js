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
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));

app.use(bodyParser.json({limit:'50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


app.listen(8084, () => console.log(`Started server at http://localhost:8084!`));