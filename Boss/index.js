const express = require('express');
const bodyParser = require('body-parser');


const cors=require('cors')
const router=require('./routerNew')

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cors())
app.use('/api',router)

app.use(bodyParser.json({limit:'50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


app.listen(8088, () => console.log(`Started server at http://localhost:8088!`));